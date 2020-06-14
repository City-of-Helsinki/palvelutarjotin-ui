import { createAction } from '@reduxjs/toolkit';

import { MOBILE_MENU_ACTIONS } from './constants';

const closeMobileMenu = createAction(MOBILE_MENU_ACTIONS.CLOSE_MOBILE_MENU);
const openMobileMenu = createAction(MOBILE_MENU_ACTIONS.OPEN_MOBILE_MENU);

export { closeMobileMenu, openMobileMenu };
