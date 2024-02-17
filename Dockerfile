# =======================================
FROM helsinkitest/node:20-slim as appbase
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
ARG NEXT_PUBLIC_RELEASE
ARG NEXT_PUBLIC_COMMITHASH

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
FROM helsinkitest/node:20-slim AS production
# ==========================================

ARG NEXT_PUBLIC_CAPTCHA_KEY
ARG NEWSLETTER_BASE_URL
ARG NEWSLETTER_APIKEY
ENV NEWSLETTER_BASE_URL=$NEWSLETTER_BASE_URL
ENV NEWSLETTER_APIKEY=$NEWSLETTER_APIKEY

# Use non-root user
USER appuser

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# copy only the necessary files for a production deployment including select files in node_modules.
COPY --from=builder --chown=appuser:appuser /app/.next/standalone .
COPY --from=builder --chown=appuser:appuser /app/.next/static ./.next/static
COPY --from=builder --chown=appuser:appuser /app/public ./public
RUN cp -r /app/.next/ /app/.next_orig/

# Copy public package.json and yarn.lock files
COPY --chown=appuser:appuser public package.json yarn.lock /app/

# Install production dependencies
RUN yarn install --production --frozen-lockfile && yarn cache clean --force

# Copy public folder
COPY --chown=appuser:appuser public /app/public

# Expose port
EXPOSE $PORT

# Start nextjs server
CMD ["node", "./server.js"]

