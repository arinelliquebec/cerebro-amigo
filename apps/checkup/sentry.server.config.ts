import * as Sentry from "@sentry/nextjs";
import type { ErrorEvent, EventHint } from "@sentry/nextjs";

// Superfície PÚBLICA de triagem de saúde mental (LGPD categoria especial).
// Endurecido: sem PII por default, e beforeSend raspa qualquer dado de request
// que possa carregar contexto da sessão (corpo, cookies, headers, query, sid na URL).
// Respostas item-a-item nunca trafegam pelo servidor — isto é defesa em profundidade.
function scrub(event: ErrorEvent): ErrorEvent {
  if (event.request) {
    delete event.request.data;
    delete event.request.cookies;
    delete event.request.headers;
    if (event.request.query_string) event.request.query_string = "[scrubbed]";
    if (event.request.url) event.request.url = event.request.url.split("?")[0];
  }
  if (event.user) {
    // não atribuímos usuário, mas se algo vazar (ip_address etc.), remove
    delete event.user;
  }
  return event;
}

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,

  sendDefaultPii: false,
  // Não anexar variáveis locais aos stack frames: poderiam conter escore/faixa de triagem.
  includeLocalVariables: false,

  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  beforeSend: (event: ErrorEvent, _hint: EventHint) => scrub(event),
});
