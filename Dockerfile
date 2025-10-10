# =======================================
FROM registry.access.redhat.com/ubi9/nodejs-20 AS deps
# =======================================


# install yarn
USER root
RUN curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo
RUN yum -y install yarn

RUN yum update -y && \
    yum install -y rsync

WORKDIR /workspace-install

COPY --chown=default:root yarn.lock ./

WORKDIR /docker-context
COPY --chown=default:root . /docker-context

# mount type bind is not supported on current version (4.10.35) of OpenShift build
# RUN --mount=type=bind,source=./,target=/docker-context \
RUN rsync -amv \
    --chown=default:root \
    --exclude='node_modules' \
    --exclude='*/node_modules' \
    --include='package.json' \
    --include='*/' --exclude='*' \
    /docker-context/ /workspace-install/;

RUN chown -R default:root .

# remove rsync, unused dependencies, and clean yum cache
RUN yum remove -y rsync && \
    yum autoremove -y && \
    yum clean all && \
    rm -rf /var/cache/yum


# =============================
FROM deps AS development
# =============================

# Set NODE_ENV to development in the development container
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

# Enable hot reload by default by polling for file changes.
#
# NOTE: Can be disabled by setting WATCHPACK_POLLING=false in file `.env`
#       if hot reload works on your system without polling to save CPU time.
ARG WATCHPACK_POLLING=true
ENV WATCHPACK_POLLING=${WATCHPACK_POLLING}

WORKDIR /app

# copy in our source code last, as it changes the most
COPY --chown=default:root . .

RUN yarn install --immutable --inline-builds

# Bake package.json start command into the image
CMD ["yarn", "dev"]

# ===================================
FROM deps AS staticbuilder
# ===================================
# Set environmental variables (when building image on GitLab CI) 
# specified in gitlab-ci.yml file  
ARG SKIP_BUILD_STATIC_GENERATION

# Debug: Show the value of SKIP_BUILD_STATIC_GENERATION
RUN echo "SKIP_BUILD_STATIC_GENERATION ARG value: $SKIP_BUILD_STATIC_GENERATION"

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

# Debug: Show the value of NEXT_PUBLIC_MATOMO_SRC_URL
RUN echo "NEXT_PUBLIC_MATOMO_SRC_URL ARG value: $NEXT_PUBLIC_MATOMO_SRC_URL"

ARG NEXT_PUBLIC_MATOMO_TRACKER_URL
ARG NEXT_PUBLIC_MATOMO_ENABLED

# CMS
ARG NEXT_PUBLIC_CMS_TERMS_OF_SERVICE_SLUG_FI
ARG NEXT_PUBLIC_CMS_TERMS_OF_SERVICE_SLUG_EN
ARG NEXT_PUBLIC_CMS_TERMS_OF_SERVICE_SLUG_SV
ARG NEXT_PUBLIC_CMS_HEADER_MENU_NAME_FI
ARG NEXT_PUBLIC_CMS_HEADER_MENU_NAME_EN
ARG NEXT_PUBLIC_CMS_HEADER_MENU_NAME_SV
ARG NEXT_PUBLIC_CMS_FOOTER_MENU_NAME_FI
ARG NEXT_PUBLIC_CMS_FOOTER_MENU_NAME_EN
ARG NEXT_PUBLIC_CMS_FOOTER_MENU_NAME_SV

WORKDIR /app
USER root

# copy all files
COPY --chown=default:root . .
COPY --from=deps --chown=default:root /workspace-install ./


RUN yarn install --immutable --inline-builds

# Build application
RUN yarn build

# ==========================================
FROM staticbuilder AS production
# ==========================================

USER default

ARG PORT
ARG NEXT_PUBLIC_CAPTCHA_KEY
ARG NEWSLETTER_BASE_URL
ARG NEWSLETTER_APIKEY
ENV NEWSLETTER_BASE_URL=$NEWSLETTER_BASE_URL
ENV NEWSLETTER_APIKEY=$NEWSLETTER_APIKEY
ENV PATH $PATH:/app/node_modules/.bin
ENV NODE_ENV production
ENV PORT $PORT
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# copy only the necessary files for a production deployment including select files in node_modules.
# Copy the configuration files to the apps/project root
COPY --from=staticbuilder --chown=default:root /app/next.config.js \
    /app/next-i18next.config.js \
    /app/package.json \
    /app/yarn.lock \
    /app/
COPY --from=staticbuilder --chown=default:root /app/.next/standalone .
COPY --from=staticbuilder --chown=default:root /app/.next/static ./.next/static
COPY --from=staticbuilder --chown=default:root /app/public ./public

# OpenShift write access to Next cache folder
USER root
RUN chgrp -R 0 /app/.next/server/pages && chmod g+w -R /app/.next/server/pages
USER default

# Expose port
EXPOSE $PORT
# Start nextjs server
CMD ["node", "/app/server.js"]


