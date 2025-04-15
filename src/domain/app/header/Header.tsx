import { useRouter } from 'next/router';
import React from 'react';
import { MenuItem, Navigation } from 'react-helsinki-headless-cms';

import HeaderNotification from './HeaderNotification';
import { useCmsMenuItems } from './useCmsMenuItems';
import { useGetPathnameForLanguage } from './useGetPathnameForLanguage';
import useLocale from '../../../hooks/useLocale';
import { HARDCODED_LANGUAGES } from '../../headless-cms/constants';
import { getIsItemActive } from '../../headless-cms/utils';
import { ROUTES } from '../routes/constants';

const Header: React.FC = () => {
  const router = useRouter();
  const locale = useLocale();
  const { menu } = useCmsMenuItems();
  const getPathnameForLanguage = useGetPathnameForLanguage();

  const goToPage =
    (pathname: string) =>
    (event?: React.MouseEvent<HTMLAnchorElement> | Event) => {
      event?.preventDefault();
      router.push(pathname);
    };

  return (
    <>
      <Navigation
        languages={HARDCODED_LANGUAGES}
        menu={menu}
        onTitleClick={goToPage(ROUTES.HOME)}
        getIsItemActive={(menuItem: MenuItem) =>
          getIsItemActive(menuItem, locale)
        }
        getPathnameForLanguage={getPathnameForLanguage}
      />
      <HeaderNotification />
    </>
  );
};

export default Header;
