export type FeatureFlags = {
  HEADLESS_CMS: boolean;
  FORMIK_PERSIST: boolean;
  NEWSLETTER: boolean;
};

export const getFeatureFlags = (): FeatureFlags => ({
  HEADLESS_CMS: process.env.NEXT_PUBLIC_HEADLESS_CMS_ENABLED === 'true',
  FORMIK_PERSIST: process.env.NEXT_PUBLIC_FORMIK_PERSIST === 'true',
  NEWSLETTER: process.env.NEXT_PUBLIC_NEWSLETTER_ENABLED === 'true',
});

export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean =>
  getFeatureFlags()[feature];
