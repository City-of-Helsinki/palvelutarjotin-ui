# =======================================
FROM helsinkitest/node:12-slim as appbase
# =======================================

# Use non-root user
USER appuser

# Yarn
ENV YARN_VERSION 1.22.4
RUN yarn policies set-version $YARN_VERSION

# Install dependencies
COPY --chown=appuser:appuser package.json yarn.lock /app/
RUN yarn && yarn cache clean --force

# Copy all files
COPY --chown=appuser:appuser . .

# =============================
FROM appbase as development
# =============================

# Use non-root user
USER appuser

# copy all files
COPY --chown=appuser:appuser . .

# Bake package.json start command into the image
CMD ["yarn", "dev"]

# ===================================
FROM appbase as staticbuilder
# ===================================
# Set environmental variables (when building image on GitLab CI) 
# specified in gitlab-ci.yml file  
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_ENVIRONMENT
ARG NEXT_PUBLIC_CAPTCHA_KEY

# Use non-root user
USER appuser

# copy all files
COPY --chown=appuser:appuser . .

# Build application
RUN yarn build

# ==========================================
FROM helsinkitest/node:12-slim AS production
# ==========================================

# Use non-root user
USER appuser

# Copy build folder from stage 1
COPY --from=staticbuilder --chown=appuser:appuser /app/.next /app/.next

# Copy next.js config
COPY --chown=appuser:appuser next.config.js /app/

# Copy public package.json and yarn.lock files
COPY --chown=appuser:appuser public package.json yarn.lock /app/

# Install production dependencies
RUN yarn install --production

# Copy public folder
COPY --chown=appuser:appuser public /app/public

# Copy i18.ts, start.js and server.js files
COPY --chown=appuser:appuser src/i18n.ts src/start.js src/server.js /app/src/

# Expose port
EXPOSE $PORT

# Start ssr server
CMD ["yarn", "start"]


