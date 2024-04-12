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
    webpack \ 
    package.json \
    pnpm-lock.yaml \
    build.tsx \ 
    babel.config.json \ 
    tsconfig.json

# Copy over production web-server code
COPY ./server/*.mjs ./server/

# Copy over production server package.json
COPY ./server/package.json ./package.json

# Install production dependencies
RUN pnpm install --prod

# Start the pm2 node process manager script.
CMD ["node", "./server/pm2.mjs"]

