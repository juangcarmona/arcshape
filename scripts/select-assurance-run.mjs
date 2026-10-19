let input = "";
for await (const chunk of process.stdin) input += chunk;

const run = JSON.parse(input);
const runId = Number.isSafeInteger(run.id) && run.id > 0 ? run.id : "";
const sourceCommit = /^[a-f0-9]{40}$/i.test(run.head_sha ?? "")
  ? run.head_sha
  : "";

console.log(`run_id=${runId}`);
console.log(`source_commit=${sourceCommit}`);
