# Current portfolio runtime

This is the canonical description of the public Cérebro Amigo portfolio environment.

| Layer | Current runtime |
|---|---|
| Frontend | Vercel (`apps/web` and `apps/checkup`) |
| Backend | Azure Container Apps |
| Database | Azure Database for PostgreSQL Flexible Server |
| Azure region | `eastus2` (United States) |
| Data | Fictional, reproducible demonstration data only |

The current public environment is a portfolio demonstration, not an active medical
service. It does **not** claim that data is resident in Brazil. Real patient or
clinical data must not be entered into this environment.

AWS material in this repository documents the previous deployment and remains as
historical or reference architecture. AWS is not part of the current public
portfolio request path. Any environment intended for real clinical data requires a
new architecture decision covering data residency, private networking, high
availability, RPO/RTO, security validation, and LGPD controls before activation.

ADR-080 is the decision record for this runtime.
