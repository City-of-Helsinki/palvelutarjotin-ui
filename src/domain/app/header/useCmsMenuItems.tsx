import { useMenuQuery } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';

import { DEFAULT_HEADER_MENU_NAME } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import { isFeatureEnabled } from '../../../utils/featureFlags';

export const useCmsMenuItems = () => {
  const locale = useLocale();
  const { data: navigationData } = useMenuQuery({
    skip: !isFeatureEnabled('HEADLESS_CMS') || !locale,
    variables: {
      id: DEFAULT_HEADER_MENU_NAME[locale],
      menuIdentifiersOnly: true,
    },
  });

  return {
    menu: navigationData?.menu,
  };
};
