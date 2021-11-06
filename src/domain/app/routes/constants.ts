export enum ROUTES {
  EVENTS_SEARCH = '/search',
  EVENT_DETAILS = '/event/:id',
  CREATE_ENROLMENT = '/event/:id/enrolment/create',
  HOME = '/',
  PRIVACY_POLICY = '/privacy-policy',
  CMS_PAGE = '/cms-page/:slug',
}

export enum PATHNAMES {
  CMS_PAGE = '/cms-page/[...slug]',
}
