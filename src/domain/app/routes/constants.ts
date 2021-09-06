export enum ROUTES {
  EVENT_DETAILS = '/event/:id',
  CREATE_ENROLMENT = '/event/:id/enrolment/create',
  HOME = '/',
  PRIVACY_POLICY = '/privacy-policy',
  CMS_PAGE = '/cms-page/:id',
}

export enum PATHNAMES {
  CMS_PAGE = '/cms-page/[...slug]',
}
