/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
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

  static get URLRewriteMapping() {
    return {
      //   [AppConfig.linkedEventsEventEndpoint]: ROUTES.COURSES.replace(
      //     '/[eventId]',
      //     ''
      //   ),
      //   [`${AppConfig.cmsOrigin}[/fi|/en|/sv]*${AppConfig.cmsArticlesContextPath}`]:
      //     ROUTES.ARTICLES.replace('/[...slug]', ''),
      [`${AppConfig.cmsOrigin}[/fi|/en|/sv]*${AppConfig.cmsPagesContextPath}`]:
        '/cms-page/',
    };
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
