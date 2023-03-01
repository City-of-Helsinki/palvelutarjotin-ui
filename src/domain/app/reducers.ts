import { combineReducers, createReducer } from '@reduxjs/toolkit';

export const defaultMobileMenuState = {
  isMenuOpen: false,
};

export const defaultReducer = createReducer(defaultMobileMenuState, () => {});

export default combineReducers({
  mobileMenu: defaultReducer,
});
