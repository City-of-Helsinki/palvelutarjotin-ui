export enum NewsletterGroupId {
  // CULTURAL_EDUCATION = '0f59fb0fe9d0192185ec00aec17290e4',
  ELEMENTARY_SCHOOL = '036765ce8c870d8dc6e2e4805754edc3',
  EARLY_CHILDHOOD_EDUCATION = 'b36d5372abf3d5193102e7fe93a25f47',
  HIGH_AND_SECONDARY_SCHOOLS = '536a600319a708507bb85c0b9ad7b9aa',
}

export type NewsletterSubscribeFormFields = {
  groups: NewsletterGroupId[];
  firstName: string;
  lastName: string;
  email: string;
};
