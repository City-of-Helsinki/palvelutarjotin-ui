import { createReducer } from '@reduxjs/toolkit';

import { MOBILE_MENU_ACTIONS } from './constants';
import { MobileMenuState } from './types';

export const defaultMobileMenuState: MobileMenuState = {
  isMenuOpen: false,
};

const mobileMenuReducer = createReducer(defaultMobileMenuState, {
  [MOBILE_MENU_ACTIONS.CLOSE_MOBILE_MENU]: (state) =>
    Object.assign({}, state, { isMenuOpen: false }),
  [MOBILE_MENU_ACTIONS.OPEN_MOBILE_MENU]: (state) =>
    Object.assign({}, state, { isMenuOpen: true }),
});

export default mobileMenuReducer;
