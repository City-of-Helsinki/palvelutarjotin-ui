import { combineReducers, createReducer } from '@reduxjs/toolkit';

export const defaultMobileMenuState = {
  isMenuOpen: false,
};

export const defaultReducer = createReducer(
  defaultMobileMenuState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (builder) => {}
);

export default combineReducers({
  mobileMenu: defaultReducer,
});
