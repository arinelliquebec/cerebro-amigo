// next.config.ts — espelhar a config de apps/web (PPR/cacheComponents + React Compiler).
// Se as flags em apps/web estiverem em outro formato/posição, copiar de lá: a
// fonte de verdade é o app web, não este stub.

import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  output: process.env.VERCEL ? undefined : "standalone",
  // @react-pdf/renderer quebra quando empacotado pelo Turbopack — o reconciler estoura
  // "Cannot read properties of undefined (reading 'S')" em runtime (appendChild). Externalizar
  // carrega o pacote nativo de node_modules no servidor, sem bundlar. NÃO usar transpilePackages.
  serverExternalPackages: ["@react-pdf/renderer"],
};

// CK-1: observabilidade da superfície pública. Sem auth token (build do EC2), o
// upload de source maps é pulado silenciosamente — o runtime ainda reporta via DSN.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  sourcemaps: { deleteSourcemapsAfterUpload: true },
  tunnelRoute: "/monitoring",
});
