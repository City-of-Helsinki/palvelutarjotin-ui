export enum ROUTES {
  EVENTS_SEARCH = '/search',
  EVENT_DETAILS = '/event/:id',
  CREATE_ENROLMENT = '/event/:id/enrolment/create',
  HOME = '/',
  PRIVACY_POLICY = '/privacy-policy',
  CMS_PAGE = '/cms-page/:uri',
  CMS_ARTICLE = '/cms-article/:uri',
  NEWSLETTER = '/newsletter',
  NEWSLETTER_SUBSCRIBE_API = '/api/newsletter/subscribe/:group',
}

export enum PATHNAMES {
  CMS_PAGE = '/cms-page/[...slug]',
}
