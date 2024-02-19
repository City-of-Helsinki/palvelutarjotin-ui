# =======================================
FROM registry.access.redhat.com/ubi9/nodejs-20 AS appbase
# =======================================

# install yarn
USER root
RUN curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo
RUN yum -y install yarn

WORKDIR /app

# Offical image has npm log verbosity as info. More info - https://github.com/nodejs/docker-node#verbosity
ENV NPM_CONFIG_LOGLEVEL warn

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Global npm deps in a non-root user directory
ENV NPM_CONFIG_PREFIX=/app/.npm-global
ENV PATH=$PATH:/app/.npm-global/bin

# Yarn
ENV YARN_VERSION 1.22.4
RUN yarn policies set-version ${YARN_VERSION}

# Copy package.json and package-lock.json/yarn.lock files
COPY package*.json *yarn* ./

# Install npm dependencies
ENV PATH /app/node_modules/.bin:$PATH

RUN yarn && yarn cache clean --force

# =============================
FROM appbase as development
# =============================


# Set NODE_ENV to development in the development container
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

# copy in our source code last, as it changes the most
COPY --chown=default:root . .

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

# copy all files
COPY --chown=default:root . .

# Build application
RUN yarn build

# ==========================================
FROM registry.access.redhat.com/ubi9/nodejs-20 AS production
# ==========================================

ARG NEXT_PUBLIC_CAPTCHA_KEY
ARG NEWSLETTER_BASE_URL
ARG NEWSLETTER_APIKEY
ENV NEWSLETTER_BASE_URL=$NEWSLETTER_BASE_URL
ENV NEWSLETTER_APIKEY=$NEWSLETTER_APIKEY

WORKDIR /app

ENV PATH $PATH:/app/node_modules/.bin
ENV NODE_ENV production

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# copy only the necessary files for a production deployment including select files in node_modules.
COPY --from=staticbuilder --chown=default:root /app/.next/standalone .
COPY --from=staticbuilder --chown=default:root /app/.next/static ./.next/static
COPY --from=staticbuilder --chown=default:root /app/public ./public
# RUN cp -r /app/.next/ /app/.next_orig/

# Copy public package.json and yarn.lock files
COPY --chown=default:root public package.json yarn.lock /app/

# Copy public folder
COPY --chown=default:root public /app/public

# Expose port
EXPOSE $PORT

# Start nextjs server
CMD ["node", "./server.js"]


