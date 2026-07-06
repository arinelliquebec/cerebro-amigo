# Units systemd do box clínico (ADR-077 — backup/restore-test do Postgres)

O host usa systemd timers (não há crontab — mesmo padrão do watchdog de crise).
Os scripts são instalados em `/usr/local/sbin` (cópia, não symlink: o repo no box
troca de commit a cada deploy) e as units em `/etc/systemd/system`.

## Instalação / atualização (via SSM, como root)

```bash
cd /opt/cerebro-amigo-v3
install -m 0755 infra/scripts/backup-postgres.sh /usr/local/sbin/backup-postgres.sh
install -m 0755 infra/scripts/test-restore.sh   /usr/local/sbin/test-restore.sh
install -m 0644 infra/systemd/cerebro-db-backup.service      /etc/systemd/system/
install -m 0644 infra/systemd/cerebro-db-backup.timer        /etc/systemd/system/
install -m 0644 infra/systemd/cerebro-db-restore-test.service /etc/systemd/system/
install -m 0644 infra/systemd/cerebro-db-restore-test.timer   /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now cerebro-db-backup.timer cerebro-db-restore-test.timer
```

## Agenda

| Timer | Quando | O quê |
|---|---|---|
| `cerebro-db-backup.timer` | diário 03:30 (America/Sao_Paulo) | `backup-postgres.sh` → `s3://cerebro-amigo-db-backups/postgres/daily/` (dom. também `weekly/`) |
| `cerebro-db-restore-test.timer` | domingo 05:00 (America/Sao_Paulo) | `test-restore.sh` — restaura o último backup em container efêmero e valida |

## Observabilidade (pluga no alerta P7)

- Sucesso do backup: `s3://cerebro-amigo-db-backups/postgres/last-success` (timestamp).
- Falha do backup: `/var/lib/cerebro-backup/last-error` + objeto `last-error` no prefixo.
- Resultado do restore-test: `/var/lib/cerebro-backup/last-restore-test` + objeto `last-restore-test` (`PASS`/`FAIL`).
- Alarme futuro: staleness de `last-success` > 26 h ⇒ backup parou.

Execução manual: `systemctl start cerebro-db-backup.service` / `cerebro-db-restore-test.service`
(logs: `journalctl -u cerebro-db-backup.service -n 50`).
