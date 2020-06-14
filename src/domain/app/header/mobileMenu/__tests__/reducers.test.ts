import { MOBILE_MENU_ACTIONS } from '../constants';
import reducer, { defaultMobileMenuState } from '../reducers';

describe('mobile menu reducer', () => {
  it('should handle CLOSE_MOBILE_MENU', () => {
    expect(
      reducer(defaultMobileMenuState, {
        type: MOBILE_MENU_ACTIONS.CLOSE_MOBILE_MENU,
      })
    ).toEqual({ isMenuOpen: false });
  });

  it('should handle OPEN_MOBILE_MENU', () => {
    expect(
      reducer(defaultMobileMenuState, {
        type: MOBILE_MENU_ACTIONS.OPEN_MOBILE_MENU,
      })
    ).toEqual({ isMenuOpen: true });
  });
});
