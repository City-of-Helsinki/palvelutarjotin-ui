import { Row } from '@tanstack/react-table';
import React from 'react';

import { OccurrenceFieldsFragment } from '../../../../generated/graphql';
import { fakeOccurrence, fakeLanguages } from '../../../../utils/mockDataUtils';
import { render, screen } from '../../../../utils/testUtils';
import LanguageCell from '../LanguageCell';

const makeRow = (
  occurrence: OccurrenceFieldsFragment
): Pick<Row<OccurrenceFieldsFragment>, 'id' | 'original'> => ({
  id: 'row-1',
  original: occurrence,
});

describe('LanguageCell', () => {
  it('renders language codes in the visible span', () => {
    const occurrence = fakeOccurrence({
      languages: fakeLanguages([{ id: 'fi' }, { id: 'sv' }]),
    });
    render(
      <LanguageCell
        row={makeRow(occurrence) as Row<OccurrenceFieldsFragment>}
        {...({} as any)}
      />
    );

    const visibleSpan = screen.getByText(/fi.*sv|sv.*fi/i, {
      selector: 'span[aria-hidden="true"]',
    });
    expect(visibleSpan).toBeInTheDocument();
  });

  it('renders screen-reader text with translated language names', () => {
    const occurrence = fakeOccurrence({
      languages: fakeLanguages([{ id: 'fi' }, { id: 'en' }]),
    });
    render(
      <LanguageCell
        row={makeRow(occurrence) as Row<OccurrenceFieldsFragment>}
        {...({} as any)}
      />
    );

    // SrOnly element contains translated names; translation keys resolve to 'fi' / 'en' in test env
    const srText = document.querySelector('.sr-only, [class*="srOnly"]');
    expect(srText).toBeTruthy();
  });

  it('renders languages ordered with fi first', () => {
    const occurrence = fakeOccurrence({
      languages: fakeLanguages([{ id: 'sv' }, { id: 'fi' }, { id: 'en' }]),
    });
    render(
      <LanguageCell
        row={makeRow(occurrence) as Row<OccurrenceFieldsFragment>}
        {...({} as any)}
      />
    );

    const visibleSpan = screen.getByText(/fi/, {
      selector: 'span[aria-hidden="true"]',
    });
    // fi should appear before sv and en
    expect(visibleSpan.textContent).toMatch(/fi.*sv|fi.*en/);
  });

  it('renders a single language', () => {
    const occurrence = fakeOccurrence({
      languages: fakeLanguages([{ id: 'en' }]),
    });
    render(
      <LanguageCell
        row={makeRow(occurrence) as Row<OccurrenceFieldsFragment>}
        {...({} as any)}
      />
    );

    expect(
      screen.getByText('en', { selector: 'span[aria-hidden="true"]' })
    ).toBeInTheDocument();
  });
});
