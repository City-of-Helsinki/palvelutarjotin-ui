import { combineReducers } from '@reduxjs/toolkit';

import mobileMenuReducers from './header/mobileMenu/reducers';

export default combineReducers({
  mobileMenu: mobileMenuReducers,
});
