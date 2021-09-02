export type FeatureFlags = {
  HEADLESS_CMS: boolean;
};

export const getFeatureFlags = (): FeatureFlags => ({
  HEADLESS_CMS: process.env.NEXT_PUBLIC_HEADLESS_CMS_ENABLED === 'true',
});

export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean =>
  getFeatureFlags()[feature];
