import eslintReact from "@eslint-react/eslint-plugin";
import eslintJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslintJs.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  { ignores: [".vercel", ".next", "dist", "build", "public/_pagefind", "rust-wasm/pkg", "cpp-wasm/src/wasm", "public/wasm", "src/wasm", "script-search"] },
  {
    files: ["**/*.{ts,tsx}"],
    ...eslintReact.configs["recommended-type-checked"],
    languageOptions: { parserOptions: { projectService: true } },
  },
  {
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
    },
  },
  {
    files: ["**/*.js", "**/*.cjs"],
    ...tseslint.configs.disableTypeChecked,
  },
);
