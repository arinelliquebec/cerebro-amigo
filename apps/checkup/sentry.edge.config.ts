import * as Sentry from "@sentry/nextjs";
import type { ErrorEvent } from "@sentry/nextjs";

// Mesma postura LGPD do server (ver sentry.server.config.ts).
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  sendDefaultPii: false,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  beforeSend: (event: ErrorEvent) => {
    if (event.request) {
      delete event.request.data;
      delete event.request.cookies;
      delete event.request.headers;
      if (event.request.query_string) event.request.query_string = "[scrubbed]";
      if (event.request.url) event.request.url = event.request.url.split("?")[0];
    }
    if (event.user) delete event.user;
    return event;
  },
});
