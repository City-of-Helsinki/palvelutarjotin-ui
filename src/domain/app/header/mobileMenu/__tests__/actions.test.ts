import * as actions from '../actions';
import { MOBILE_MENU_ACTIONS } from '../constants';

describe('actions', () => {
  it('should create an action to close mobile menu', () => {
    const expectedAction = {
      type: MOBILE_MENU_ACTIONS.CLOSE_MOBILE_MENU,
    };
    expect(actions.closeMobileMenu()).toEqual(expectedAction);
  });

  it('should create an action to open mobile menu', () => {
    const expectedAction = {
      type: MOBILE_MENU_ACTIONS.OPEN_MOBILE_MENU,
    };
    expect(actions.openMobileMenu()).toEqual(expectedAction);
  });
});
