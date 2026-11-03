import { config } from "@remotion/eslint-config-flat";

// src/templates = salinan template RVE (hampir apa adanya), tidak di-lint.
export default [{ ignores: ["src/templates/**"] }, ...config];
