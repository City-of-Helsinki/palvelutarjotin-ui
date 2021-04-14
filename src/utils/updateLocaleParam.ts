export const updateLocaleParam = (
  url: string,
  currentLocale: string,
  value: string
): string => {
  const post = url.endsWith(`/${currentLocale}`) ? '' : '/';
  return url.replace(`/${currentLocale}${post}`, `/${value}${post}`);
};
