import { RootState } from '../../../../types';

export const isMobileMenuOpenSelector = (state: RootState): boolean =>
  state.mobileMenu.isMenuOpen;
