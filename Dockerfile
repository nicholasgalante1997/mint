# https://pnpm.io/docker
FROM node:18-slim as node
# Set PNPM Env Variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV RUNTIME_STAGE="production"
# Enable pnpm via corepack @see https://nodejs.org/api/corepack.html
RUN corepack enable
# Create app directory
RUN mkdir -p /home/couch/mint/web
# Change into app directory
WORKDIR /home/couch/mint/web
# Copy over the package manifest and dependency lockfile
COPY ./package.json ./
COPY ./pnpm-lock.yaml ./
# Copy over app
COPY ./tsconfig.json ./
COPY ./babel.config.json ./
COPY ./build.tsx ./

COPY ./webpack/ ./webpack/
COPY ./assets/ ./assets/
COPY ./html/ ./html/
COPY ./src/ ./src/
COPY ./config/ ./config/
COPY ./data/ ./data/
COPY ./scripts/ ./scripts/

# Install build dependencies
RUN pnpm install
# Build a static dist of the website
RUN pnpm build
# Clean development source code and deps
RUN rm -rf node_modules \ 
    src \
    assets \
    html \
    scripts \
    webpack

CMD ["npx", "serve", "build", "-p", "3000"]

# # Nginx webserver
# FROM nginx as webserver
# # Copy static website over to expected distribution directory
# COPY --from=node --chown=node:webserver /home/couch/mint/web/build /usr/share/nginx/html
# # Copy over our desired nginx configuration
# COPY nginx.conf /etc/nginx/nginx.conf
