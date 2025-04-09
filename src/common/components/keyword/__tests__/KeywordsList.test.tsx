import { MockedResponse } from '@apollo/client/testing';
import * as React from 'react';

import {
  Keyword,
  KeywordSetDocument,
  KeywordSetType,
  LocalisedObject,
} from '../../../../generated/graphql';
import {
  fakeKeyword,
  fakeLocalizedObject,
} from '../../../../utils/mockDataUtils';
import { render, act, screen } from '../../../../utils/testUtils';
import KeywordsList from '../KeywordsList';

const categoryKeywords = [
  { id: 'kultus:1', name: 'Vaikuttaminen ja osallisuus' },
  { id: 'kultus:2', name: 'Teatteri, tanssi ja sirkus' },
  { id: 'kultus:3', name: 'Musiikki' },
  { id: 'kultus:4', name: 'Sanataide ja kirjallisuus' },
  { id: 'kultus:5', name: 'Tiede' },
];

const additionCriteriaKeywords = [
  { id: 'kultus:6', name: 'Työpaja' },
  { id: 'kultus:7', name: 'Luento' },
  { id: 'kultus:8', name: 'Luontokoulu' },
  { id: 'kultus:9', name: 'Kirjastovierailu' },
  { id: 'kultus:10', name: 'Konsertti' },
];

const targetGroupKeywords = [
  { id: 'kultus:11', name: 'Valmistava opetus' },
  { id: 'kultus:12', name: '1.–2. luokat' },
  { id: 'kultus:13', name: '3.–6. luokat' },
  { id: 'kultus:14', name: '7.–9. luokat' },
  { id: 'kultus:15', name: 'lukio ja ammatillinen opetus' },
];

const getKeywordSetResult = ({
  keywords,
  name,
  internalId,
}: {
  keywords: Keyword[];
  name: LocalisedObject;
  internalId: string;
}) => {
  return {
    data: {
      keywordSet: {
        keywords,
        name,
        internalId,
      },
    },
  };
};

const mocks: MockedResponse[] = [
  {
    request: {
      query: KeywordSetDocument,
      variables: { setType: KeywordSetType.AdditionalCriteria },
    },
    result: getKeywordSetResult({
      internalId:
        'https://api.hel.fi/linkedevents-test/v1/keyword_set/kultus:additional_criteria/',
      name: fakeLocalizedObject('Kultus-kategoriat'),
      keywords: additionCriteriaKeywords.map((k) =>
        fakeKeyword({ id: k.id, name: fakeLocalizedObject(k.name) })
      ),
    }),
  },
  {
    request: {
      query: KeywordSetDocument,
      variables: { setType: KeywordSetType.Category },
    },
    result: getKeywordSetResult({
      internalId:
        'https://api.hel.fi/linkedevents-test/v1/keyword_set/kultus:categories/',
      name: fakeLocalizedObject('Kultus-kategoriat'),
      keywords: categoryKeywords.map((k) =>
        fakeKeyword({ id: k.id, name: fakeLocalizedObject(k.name) })
      ),
    }),
  },
  {
    request: {
      query: KeywordSetDocument,
      variables: { setType: KeywordSetType.TargetGroup },
    },
    result: getKeywordSetResult({
      internalId:
        'https://api.hel.fi/linkedevents-test/v1/keyword_set/kultus:target_groups/',
      name: fakeLocalizedObject('Kultus Kohderyhmä'),
      keywords: targetGroupKeywords.map((k) =>
        fakeKeyword({ id: k.id, name: fakeLocalizedObject(k.name) })
      ),
    }),
  },
];

it('renders list of keywords as static texts', async () => {
  const { container } = render(
    <KeywordsList
      identifier="test-identifier"
      keywords={[
        ...categoryKeywords,
        ...targetGroupKeywords,
        ...additionCriteriaKeywords,
      ].map((k) =>
        fakeKeyword({ id: k.id, name: fakeLocalizedObject(k.name) })
      )}
    />,
    { mocks }
  );

  await act(() => new Promise((res) => setTimeout(res, 1000)));

  const categoryKeyword = screen.getByText(/vaikuttaminen ja osallisuus/i);
  expect(categoryKeyword).toBeInTheDocument();

  const targetGroupKeyword = screen.getByText(/valmistava opetus/i);
  expect(targetGroupKeyword).toBeInTheDocument();

  const additionalCriteriaKeyword = screen.getByText(/työpaja/i);
  expect(additionalCriteriaKeyword).toBeInTheDocument();
  expect(container).toMatchSnapshot();
});
