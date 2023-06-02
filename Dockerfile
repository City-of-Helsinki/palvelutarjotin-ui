# =======================================
FROM helsinkitest/node:18-slim as appbase
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
ARG NEXT_PUBLIC_APP_ORIGIN
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_UNIFIED_SEARCH_BASE_URL
ARG NEXT_PUBLIC_CMS_BASE_URL
ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_ENVIRONMENT
ARG NEXT_PUBLIC_CAPTCHA_KEY
ARG NEXT_PUBLIC_LANGUAGE_CIMODE_VISIBLE
ARG NEXT_PUBLIC_HEADLESS_CMS_ENABLED
ARG NEXT_PUBLIC_FORMIK_PERSIST
ARG NEXT_PUBLIC_NEWSLETTER_ENABLED


# Set Matomo settings
ARG NEXT_PUBLIC_MATOMO_URL_BASE
ARG NEXT_PUBLIC_MATOMO_SITE_ID
ARG NEXT_PUBLIC_MATOMO_SRC_URL
ARG NEXT_PUBLIC_MATOMO_TRACKER_URL
ARG NEXT_PUBLIC_MATOMO_ENABLED

# Use non-root user
USER appuser

# copy all files
COPY --chown=appuser:appuser . .

# Build application
RUN yarn build

# ==========================================
FROM helsinkitest/node:18-slim AS production
# ==========================================

ARG NEXT_PUBLIC_CAPTCHA_KEY
ARG NEWSLETTER_BASE_URL
ARG NEWSLETTER_APIKEY
ENV NEWSLETTER_BASE_URL=$NEWSLETTER_BASE_URL
ENV NEWSLETTER_APIKEY=$NEWSLETTER_APIKEY

# Use non-root user
USER appuser

# Copy build folder from stage 1
COPY --from=staticbuilder --chown=appuser:appuser /app/.next /app/.next

# Copy next.js config
COPY --chown=appuser:appuser next.config.js /app/
COPY --chown=appuser:appuser next-i18next.config.js /app/

# Copy public package.json and yarn.lock files
COPY --chown=appuser:appuser public package.json yarn.lock /app/

# Install production dependencies
RUN yarn install --production --frozen-lockfile && yarn cache clean --force

# Copy public folder
COPY --chown=appuser:appuser public /app/public

# Copy i18.ts, start.mjs and server.mjs files
COPY --chown=appuser:appuser src/start.mjs src/server.mjs /app/src/

# Expose port
EXPOSE $PORT

# Start ssr server
CMD ["yarn", "start"]


