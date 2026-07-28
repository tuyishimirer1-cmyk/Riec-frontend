# ---------- 1️⃣ Builder Stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests first (better caching)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the React app
RUN yarn build


# ---------- 2️⃣ Production Stage ----------
FROM node:22-alpine AS production

WORKDIR /app

# Install serve to run the static build
RUN yarn global add serve

# Copy built artifacts
COPY --from=builder /app/dist ./dist

EXPOSE 5173

# Serve the static build
CMD ["serve", "-s", "dist", "-p", "5173"]