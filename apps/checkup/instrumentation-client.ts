import * as Sentry from "@sentry/nextjs";
import type { ErrorEvent } from "@sentry/nextjs";

// Cliente do checkup (público, saúde mental). DELIBERADAMENTE SEM Session Replay:
// replay grava a tela = as respostas da pessoa ao teste (dado sensível). Capturamos
// só erros de JS, sem PII, com a mesma raspagem de request do server.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,

  sendDefaultPii: false,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  // sem replayIntegration de propósito (ver acima)
  integrations: [],

  beforeSend: (event: ErrorEvent) => {
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers;
      if (event.request.query_string) event.request.query_string = "[scrubbed]";
      if (event.request.url) event.request.url = event.request.url.split("?")[0];
    }
    if (event.user) delete event.user;
    return event;
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
