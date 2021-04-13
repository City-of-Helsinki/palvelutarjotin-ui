import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import { I18nextProvider } from 'react-i18next';
import { ApolloMockedProvider } from 'apollo-mocked';

import { PlaceDocument } from '../src/generated/graphql';
import '../src/assets/styles/main.scss';
import 'hds-core/lib/base.css';
import i18n from '../src/tests/initI18n';
import placeMock from '../src/domain/place/__mocks__/place.json';
import {createPlaceQueryMock} from "../src/tests/apollo-mocks/placeMocks";

const mocks = [createPlaceQueryMock(placeMock.data.place)];


addDecorator(withA11y);
addDecorator((story) => (
  <I18nextProvider i18n={i18n}>{story()}</I18nextProvider>
));
addDecorator((story) => (
  <ApolloMockedProvider mocks={mocks}>{story()}</ApolloMockedProvider>
));

// automatically import all files ending in *.stories.*
configure(require.context('../src', true, /\.stories\.(ts|js|md)x$/), module);
