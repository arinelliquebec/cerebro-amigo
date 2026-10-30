import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Regras de strictness do React Compiler (react-hooks v6+): flagram
      // idiomas válidos de effect (sync com sistemas externos) e componentes
      // shadcn vendored — desligadas na baseline; re-avaliar ao limpar os 49
      // pontos existentes.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "react-hooks/immutability": "off",
      // `any` legado do pré-lint: visível como warning, não bloqueia o gate.
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
    "next-env.d.ts",
    "*.tsbuildinfo",
  ]),
])
