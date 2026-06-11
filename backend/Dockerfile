FROM node:24-alpine AS deps

WORKDIR /deps

COPY package*.json ./

RUN npm ci --omit=dev


FROM node:24-alpine AS production


WORKDIR /backend

COPY --from=deps /deps/node_modules ./node_modules 

COPY . .

RUN addgroup -S appgroup && adduser -S app -G appgroup

USER app

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s \
    CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
