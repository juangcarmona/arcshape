import { createServer } from "node:http";
import { createHash } from "node:crypto";
import { copyFile, mkdir, mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { expect, test } from "@playwright/test";

test.use({ trace: "on" });

const repositoryRoot = resolve(import.meta.dirname, "..");
const archifyGeneratorRepository = "https://github.com/tt-a1i/archify";
const archifyGeneratorCommit = "1c2b42d660e4a7571813fb43839c79e3e9ca7720";
const archifySourceRevision = "2bae49f8546eb020aa48d1e5a4c203a6da0506a2";
const sourceAssets = [
  "star_wars_death_star_3d_blueprint.png",
  "star_wars_death_star_architecture_EN.png",
  "star_wars_death_star_architecture_ES.png",
];
let output;
let server;
let origin;
let sourceRevision;

test.beforeAll(async () => {
  sourceRevision = spawnSync("git", ["rev-parse", "HEAD"], {
    cwd: repositoryRoot,
    encoding: "utf8",
  }).stdout.trim();
  if (!sourceRevision) throw new Error("Could not resolve the source revision");

  output = await mkdtemp(join(tmpdir(), "arcshape-death-star-showcase-"));
  for (const locale of ["en", "es"]) {
    const localeOutput = join(output, locale, "index.html");
    await mkdir(join(output, locale), { recursive: true });
    const build = spawnSync(
      process.execPath,
      [
        "packages/cli/src/bin/arcshape.mjs",
        "site",
        "build",
        "--docs",
        `examples/starwars-deathstar/${locale}`,
        "--out",
        localeOutput,
        "--title",
        "Death Star architecture",
        "--source-ref",
        sourceRevision,
      ],
      {
        cwd: repositoryRoot,
        env: { ...process.env, GITHUB_ACTIONS: "true" },
        encoding: "utf8",
        timeout: 90_000,
      },
    );
    if (build.status !== 0) {
      throw new Error(
        build.stderr || build.stdout || `Build failed: ${locale}`,
      );
    }
    const html = await readFile(localeOutput, "utf8");
    const data = JSON.parse(
      html.match(
        /<script id="arc42-data" type="application\/json">([\s\S]*?)<\/script>/,
      )?.[1] ?? "null",
    );
    if (data?.sections?.length !== 12) {
      throw new Error(`${locale}: reader output must contain all 12 sections`);
    }
    const renderedPages = [data.readme, ...data.sections]
      .map((section) => section.html)
      .join("\n");
    if (renderedPages.includes("xref-dead")) {
      throw new Error(
        `${locale}: reader output contains an unresolved source link`,
      );
    }
  }

  const diagramDirectory = join(output, "diagrams");
  await mkdir(diagramDirectory, { recursive: true });
  const sourceDiagramDirectory = join(
    repositoryRoot,
    "examples/starwars-deathstar/diagrams",
  );
  const manifest = JSON.parse(
    await readFile(join(sourceDiagramDirectory, "manifest.json"), "utf8"),
  );
  if (
    manifest.schemaVersion !== 1 ||
    manifest.generator.name !== "Archify" ||
    manifest.generator.version !== "3.1.0" ||
    manifest.generator.repository !== archifyGeneratorRepository ||
    manifest.generator.commit !== archifyGeneratorCommit ||
    manifest.source.repository !== "https://github.com/juangcarmona/arcshape" ||
    manifest.source.revision !== archifySourceRevision ||
    manifest.candidate.path !==
      "examples/starwars-deathstar/diagrams/death-star-architecture.json" ||
    manifest.artifact.path !==
      "examples/starwars-deathstar/diagrams/death-star-architecture.html" ||
    manifest.licenses.join(",") !==
      [
        "examples/starwars-deathstar/diagrams/ARCHIFY-LICENSE.txt",
        "examples/starwars-deathstar/diagrams/THIRD_PARTY_NOTICES.md",
      ].join(",")
  ) {
    throw new Error(
      "Archify manifest does not match the merged #78 publication contract",
    );
  }
  const candidate = JSON.parse(
    await readFile(join(repositoryRoot, manifest.candidate.path), "utf8"),
  );
  if (
    candidate.meta.repository.url !== manifest.source.repository ||
    candidate.meta.repository.revision !== manifest.source.revision
  ) {
    throw new Error("Archify candidate provenance does not match its manifest");
  }
  for (const entry of [manifest.candidate, manifest.artifact]) {
    const digest = createHash("sha256")
      .update(await readFile(join(repositoryRoot, entry.path)))
      .digest("hex");
    if (digest !== entry.sha256) {
      throw new Error(`Archify manifest hash mismatch for ${entry.path}`);
    }
  }
  const diagramHtml = await readFile(
    join(repositoryRoot, manifest.artifact.path),
    "utf8",
  );
  if (
    !diagramHtml.includes('<meta name="generator" content="archify 3.1.0">') ||
    !diagramHtml.includes(
      '<meta name="archify-reader-contract" content="declared-wide-v1">',
    ) ||
    /\b(?:href|src)="\/(?!\/)/i.test(diagramHtml)
  ) {
    throw new Error(
      "Archify HTML does not satisfy the merged #78 reader and path contract",
    );
  }
  await copyFile(
    join(
      repositoryRoot,
      "examples/starwars-deathstar/diagrams/death-star-architecture.html",
    ),
    join(diagramDirectory, "death-star-architecture.html"),
  );

  for (const asset of sourceAssets) {
    const info = await stat(
      join(repositoryRoot, "examples/starwars-deathstar/assets", asset),
    );
    if (info.size === 0) throw new Error(`Source artwork is empty: ${asset}`);
  }

  server = createServer(async (request, response) => {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    const relative = pathname.startsWith("/arcshape/")
      ? pathname.slice("/arcshape/".length)
      : pathname.replace(/^\/+/, "");
    const requested = relative.endsWith("/")
      ? `${relative}index.html`
      : relative || "index.html";
    const base = resolve(output);
    const file = resolve(base, requested);
    if (!file.startsWith(`${base}${sep}`)) {
      response.writeHead(403).end();
      return;
    }
    try {
      const body = await readFile(file);
      response
        .writeHead(200, {
          "content-type":
            extname(file) === ".html"
              ? "text/html; charset=utf-8"
              : "application/octet-stream",
        })
        .end(body);
    } catch {
      response.writeHead(404).end("Not found");
    }
  });
  await new Promise((resolveListen, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolveListen);
  });
  origin = `http://127.0.0.1:${server.address().port}`;
});

test.afterAll(async () => {
  if (server) {
    server.closeAllConnections();
    await new Promise((resolveClose) => server.close(resolveClose));
  }
  if (output) await rm(output, { recursive: true, force: true });
});

test("bilingual reader builds, links sources, and works at root and subpath", async ({
  page,
}) => {
  const externalRequests = [];
  page.on("request", (request) => {
    if (!request.url().startsWith(origin)) externalRequests.push(request.url());
  });

  for (const base of ["", "/arcshape"]) {
    for (const locale of ["en", "es"]) {
      await page.setViewportSize({
        width: locale === "es" && base ? 375 : 1440,
        height: locale === "es" && base ? 812 : 900,
      });
      await page.goto(`${origin}${base}/${locale}/`);
      await expect(page.locator("aside.nav a[href^='#/section/']")).toHaveCount(
        12,
      );

      await page.keyboard.press("Tab");
      const firstFocus = await page.evaluate(
        () => document.activeElement?.tagName,
      );
      expect(firstFocus).not.toBe("BODY");
      await page.locator("aside.nav a[href='#/section/12']").focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/#\/section\/12$/);
      await expect(page.locator(".doc-body")).toContainText(
        locale === "en"
          ? "Source, License, and Artwork"
          : "Fuente, licencia e imágenes",
      );
      const legalDisclosure = page.locator(".doc-body");
      await expect(legalDisclosure).toContainText(
        "6a5576bda72de08a217ccdf94461c5eaeea9f8a5",
      );
      await expect(legalDisclosure).toContainText("CC BY-NC 4.0");
      await expect(legalDisclosure).toContainText(
        locale === "en"
          ? "Changes adapt the material"
          : "El material se adaptó",
      );
      await expect(legalDisclosure).toContainText(
        locale === "en" ? "not affiliated" : "no está afiliada",
      );
      await expect(
        legalDisclosure.locator(
          "a[href*='starwars-deathstar-arc42-documentation/tree/6a5576bda72de08a217ccdf94461c5eaeea9f8a5']",
        ),
      ).toBeVisible();

      for (const asset of sourceAssets) {
        const link = page.locator(`.doc-body a[href*="${asset}"]`).first();
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute(
          "href",
          new RegExp(
            `/blob/${sourceRevision}/examples/starwars-deathstar/assets/${asset}$`,
          ),
        );
      }

      const runtimeLink = page.locator("aside.nav a[href='#/section/06']");
      await runtimeLink.focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/#\/section\/06$/);
      await expect(page.locator(".doc-body figure.diagram")).toHaveCount(3);
      const diagrams = page.locator(".doc-body figure.diagram svg[role='img']");
      await expect(diagrams).toHaveCount(3);
      for (const [index, image] of (await diagrams.all()).entries()) {
        const expectedName =
          locale === "en"
            ? [
                "Planetary destruction sequence",
                "Intruder detection and response",
                "Hyperdrive activation and navigation",
              ][index]
            : ["destrucción planetaria", "intrusos", "hiperimpulsor"][index];
        await expect(image).toHaveAccessibleName(new RegExp(expectedName, "i"));
      }

      if (locale === "en" && !base) {
        await page.screenshot({
          path: test.info().outputPath("death-star-en-desktop.png"),
          fullPage: true,
        });
      }
      if (locale === "es" && base) {
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        await page.screenshot({
          path: test.info().outputPath("death-star-es-phone.png"),
          fullPage: true,
        });
      }
    }
  }
  expect(externalRequests).toEqual([]);
});

test("Archify artifact preserves accessible identity and revision provenance at both bases", async ({
  page,
}) => {
  const externalRequests = [];
  page.on("request", (request) => {
    if (!request.url().startsWith(origin)) externalRequests.push(request.url());
  });

  for (const base of ["", "/arcshape"]) {
    await page.setViewportSize({ width: 1600, height: 1100 });
    await page.goto(`${origin}${base}/diagrams/death-star-architecture.html`);
    await expect(page.locator('meta[name="generator"]')).toHaveAttribute(
      "content",
      "archify 3.1.0",
    );
    await expect(
      page.locator('meta[name="archify-reader-contract"]'),
    ).toHaveAttribute("content", "declared-wide-v1");
    await expect(
      page.getByRole("heading", { name: "Death Star systems" }),
    ).toBeVisible();
    await expect(page.locator("p.subtitle")).toHaveText(
      `Archify 3.1.0 · source revision ${archifySourceRevision}`,
    );
    await expect(
      page.locator('[aria-label^="Focus Imperial Command"]').first(),
    ).toBeVisible();
    expect(
      await page.locator("#archify-source-evidence-data").textContent(),
    ).toContain(archifySourceRevision);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (!base) {
      await page.screenshot({
        path: test.info().outputPath("death-star-archify-desktop.png"),
        fullPage: true,
      });
    }
    await page
      .locator('[aria-label^="Focus Imperial Command"]')
      .first()
      .click();
    await expect(
      page.locator(`a[href*="/blob/${archifySourceRevision}/"]`).first(),
    ).toBeVisible();
  }
  expect(externalRequests).toEqual([]);
});
