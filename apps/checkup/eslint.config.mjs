import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Regras de strictness do React Compiler (react-hooks v6+): flagram
      // idiomas válidos de effect (sync com sistemas externos) — desligadas
      // na baseline, igual ao apps/web; re-avaliar ao limpar os pontos.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      // Convenção do codebase: `_` marca binding intencionalmente ignorado
      // (ex.: omit via rest `const { [id]: _, ...resto } = obj`).
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_", ignoreRestSiblings: true },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "public/**",
    "coverage/**",
    "next-env.d.ts",
    "*.tsbuildinfo",
  ]),
])
