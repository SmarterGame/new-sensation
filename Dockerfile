FROM node:18-alpine as base
# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app



COPY package.json package-lock.json*  ./

RUN \
	if [ -f package-lock.json ]; then npm ci; \
	else echo "Lockfile not found." && exit 1; \
	fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM gcr.io/distroless/nodejs20-debian12:nonroot
COPY --from=builder /app/.next/standalone/ /app
COPY --from=builder /app/public /app/public
COPY --from=builder /app/.next/static /app/.next/static
ENV HOSTNAME "0.0.0.0"
# nonroot user id
USER 65532 
EXPOSE 3000
WORKDIR /app
CMD ["server.js"]