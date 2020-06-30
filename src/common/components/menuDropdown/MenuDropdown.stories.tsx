import { boolean, radios, text } from '@storybook/addon-knobs';
import { IconGlobe } from 'hds-react';
import React, { ReactElement } from 'react';

import MenuDropdown from './MenuDropdown';

const Wrapper = ({ children }) => (
  <div
    style={{
      padding: '2.5rem',
      maxWidth: '15rem',
    }}
  >
    {children}
  </div>
);

const items = [
  {
    text: 'Option 1',
    value: 'option_1',
  },
  {
    text: 'Option 2',
    value: 'option_2',
  },
  {
    text: 'Option 3',
    value: 'option_3',
  },
];

const getKnobs = () => ({
  buttonAriaLabel: text('buttonAriaLabel', 'Select'),
  buttonText: text('buttonText', 'Select...'),
  icon: boolean('Icon', false) ? <IconGlobe /> : undefined,
  value: radios(
    'value',
    Object.assign({}, ...items.map((item) => ({ [item.text]: item.value }))),
    items[0].value
  ),
});

export default {
  title: 'MenuDropdown',
  component: MenuDropdown,
};

export const Dropdown = (): ReactElement => {
  return (
    <Wrapper>
      <MenuDropdown {...getKnobs()} items={items} />
    </Wrapper>
  );
};
