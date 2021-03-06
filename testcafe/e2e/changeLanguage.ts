import { screen } from '@testing-library/testcafe';

import { header } from '../selectors/header';
import { getPathname } from '../utils/clientUtils';
import { getEnvUrl } from '../utils/settings';

fixture('Events page').page(getEnvUrl('fi'));

test('Changing language on events page', async (t) => {
  await t
    .expect(
      screen.getByRole('heading', {
        name: /Oppimisen elämyksiä koko kaupungissa/i,
      }).exists
    )
    .ok();

  await t
    .click(header.languageSelector)
    .click(header.languageSelectorItemSv)
    .expect(getPathname())
    .eql('/sv');

  await t
    .expect(
      screen.queryByRole('heading', {
        name: /Konst, kultur och evenemang för skolor och dagis/i,
      }).exists
    )
    .ok();
});
