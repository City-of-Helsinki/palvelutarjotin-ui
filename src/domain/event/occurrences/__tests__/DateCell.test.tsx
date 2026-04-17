import { Row } from '@tanstack/react-table';
import React from 'react';

import { OccurrenceFieldsFragment } from '../../../../generated/graphql';
import { fakeOccurrence } from '../../../../utils/mockDataUtils';
import { render, screen, userEvent } from '../../../../utils/testUtils';
import DateCell, { DateCellProps } from '../DateCell';

const makeRow = (
  occurrence: OccurrenceFieldsFragment,
  id = 'row-1'
): Pick<Row<OccurrenceFieldsFragment>, 'id' | 'original'> => ({
  id,
  original: occurrence,
});

const defaultProps = (overrides?: Partial<DateCellProps>): DateCellProps => ({
  row: makeRow(fakeOccurrence()) as Row<OccurrenceFieldsFragment>,
  neededOccurrences: 1,
  isDisabledOccurrenceCheckbox: () => false,
  handleOccurrenceCheckboxClick: jest.fn(),
  isSelectedOccurrence: () => false,
  locale: 'fi',
  // CellContext fields not used by the component

  ...(overrides as any),
});

describe('DateCell', () => {
  it('renders formatted single-day date', () => {
    const occurrence = fakeOccurrence({
      startTime: '2024-03-15T09:00:00+00:00',
      endTime: '2024-03-15T10:00:00+00:00',
    });
    render(
      <DateCell
        {...defaultProps({
          row: makeRow(occurrence) as Row<OccurrenceFieldsFragment>,
        })}
      />
    );

    // The formatted date should appear (formatLocalizedDate with 'fi' locale)
    expect(screen.getByText(/15\.3\.2024/)).toBeInTheDocument();
  });

  it('renders a date range for multiday occurrences', () => {
    const occurrence = fakeOccurrence({
      startTime: '2024-03-15T09:00:00+00:00',
      endTime: '2024-03-17T10:00:00+00:00',
    });
    render(
      <DateCell
        {...defaultProps({
          row: makeRow(occurrence) as Row<OccurrenceFieldsFragment>,
        })}
      />
    );

    // formatDateRange produces a range string with an em dash
    expect(screen.getByText(/15\.3\.2024/)).toBeInTheDocument();
    expect(screen.getByText(/17\.3\.2024/)).toBeInTheDocument();
  });

  it('does not render checkbox when neededOccurrences is 1', () => {
    render(<DateCell {...defaultProps({ neededOccurrences: 1 })} />);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('does not render checkbox when neededOccurrences is undefined', () => {
    render(<DateCell {...defaultProps({ neededOccurrences: undefined })} />);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('renders checkbox when neededOccurrences > 1', () => {
    render(<DateCell {...defaultProps({ neededOccurrences: 2 })} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders checkbox as checked when occurrence is selected', () => {
    render(
      <DateCell
        {...defaultProps({
          neededOccurrences: 2,
          isSelectedOccurrence: () => true,
        })}
      />
    );
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('renders checkbox as unchecked when occurrence is not selected', () => {
    render(
      <DateCell
        {...defaultProps({
          neededOccurrences: 2,
          isSelectedOccurrence: () => false,
        })}
      />
    );
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('renders checkbox as disabled when isDisabledOccurrenceCheckbox returns true', () => {
    render(
      <DateCell
        {...defaultProps({
          neededOccurrences: 2,
          isDisabledOccurrenceCheckbox: () => true,
        })}
      />
    );
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('calls handleOccurrenceCheckboxClick when checkbox is clicked', async () => {
    const handleClick = jest.fn();
    const occurrence = fakeOccurrence();
    const user = userEvent.setup();
    render(
      <DateCell
        {...defaultProps({
          neededOccurrences: 2,
          row: makeRow(occurrence) as Row<OccurrenceFieldsFragment>,
          handleOccurrenceCheckboxClick: handleClick,
        })}
      />
    );

    await user.click(screen.getByRole('checkbox'));
    expect(handleClick).toHaveBeenCalledWith(occurrence);
  });
});
