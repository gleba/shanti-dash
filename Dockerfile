FROM oven/bun:1

RUN bun i

EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "./server.ts" ]