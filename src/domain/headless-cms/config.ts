class AppConfig {
  static get origin() {
    return getEnvOrError(
      process.env.NEXT_PUBLIC_APP_ORIGIN,
      'NEXT_PUBLIC_APP_ORIGIN'
    );
  }
  static get cmsGraphqlEndpoint() {
    return getEnvOrError(
      process.env.NEXT_PUBLIC_CMS_BASE_URL,
      'NEXT_PUBLIC_CMS_BASE_URL'
    );
  }
  static get cmsOrigin() {
    return new URL(AppConfig.cmsGraphqlEndpoint).origin;
  }

  //   static get cmsArticlesContextPath() {
  //     // NOTE: not in use yet
  //     return process.env.NEXT_PUBLIC_CMS_ARTICLES_CONTEXT_PATH ?? '/articles';
  //   }

  static get cmsPagesContextPath() {
    // TODO: Implement pages-structure:
    // every generic page should be a sub page for a page with slug "pages".
    // return process.env.NEXT_PUBLIC_CMS_PAGES_CONTEXT_PATH ?? '/pages';
    return '/';
  }

  /**
   * URL rewrite mapping for internal URLs.
   * Replace the URL with the value in the mapping.
   * If the URL is a CMS URL for pages, articles or other content,
   * except not for files, the URL should be rewritten to the internal URL.
   *
   * Some examples that are valid:
   * - https://kultus.content.api.hel.fi/fi/
   * - https://kultus.content.api.hel.fi/sv/
   * - https://kultus.content.api.hel.fi/en/
   * - https://kultus.content.api.hel.fi/fi/asdas/asdas
   * - https://kultus.content.api.hel.fi/fi/something/
   *
   * Examples that are invalid:
   * - https://kultus.content.api.hel.fi/app/images
   * - https://kultus.content.api.hel.fi/app/pictures
   * - https://kultus.content.api.hel.fi/app/files
   */
  static get URLRewriteMapping() {
    return [
      // Exclusionary rule: URLs that should *not* be rewritten
      {
        regex: `^${AppConfig.cmsOrigin}/app/`,
        replace: '', // We don't need a replacement for exclusions.
        skip: true,
      },
      // Matches URLs with a locale prefix (fi, en, sv)
      {
        regex: `^${AppConfig.cmsOrigin}/(fi|en|sv)(.*)$`,
        replace: '/$1/cms-page$2',
      },
      // Matches root page
      {
        regex: `^${AppConfig.cmsOrigin}/$`,
        replace: '/cms-page/',
      },
      // Matches URLs without a locale prefix (other paths)
      {
        regex: `^${AppConfig.cmsOrigin}/(.*)$`,
        replace: '/cms-page/$1',
      },
    ];
  }
}

// Accept both variable and name so that variable can be correctly replaced
// by build.
// process.env.VAR => value
// process.env["VAR"] => no value
// Name is used to make debugging easier.
function getEnvOrError(variable?: string, name?: string) {
  if (!variable) {
    throw Error(`Environment variable with name ${name} was not found`);
  }

  return variable;
}

export default AppConfig;
