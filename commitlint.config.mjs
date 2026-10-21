export default {
  extends: ["@commitlint/config-conventional"],
  ignores: [(message) => message === "chore(release): version packages"],
  rules: {
    "references-empty": [2, "never"],
  },
};
