FROM postgres:16-alpine

COPY seed/portfolio.sql /seed/portfolio.sql
COPY azure/run-portfolio-seed.sh /usr/local/bin/run-portfolio-seed

RUN chmod 0555 /usr/local/bin/run-portfolio-seed

ENTRYPOINT ["/usr/local/bin/run-portfolio-seed"]
