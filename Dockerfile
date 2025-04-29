# ========================
# Build stage
# ========================
FROM node:20 AS build

WORKDIR /usr/src/app

# Copy essential files first to leverage cache
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma
COPY .env .env

# Install development dependencies
RUN npm install

# ⚠️ Dummy variable so Prisma doesn't fail during build
ENV POSTGRES_URL="postgresql://dummy:dummy@localhost:5432/db"

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY ./src ./src

# Compile TypeScript and apply path aliases
RUN npm run build

# ========================
# Production stage
# ========================
FROM node:20 AS production

WORKDIR /usr/src/app

# Only install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy build artifacts from build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/.env .env

EXPOSE 3000

CMD ["node", "dist/app.js"]
