import classNames from 'classnames';
import React, { ReactElement } from 'react';
import { Column, Row, useTable, useExpanded } from 'react-table';

import styles from './table.module.scss';
import { ExtendedHeaderGroup, ExtendedCell, ExtendedRow } from './types';

type Props<D extends Record<string, unknown>> = {
  columns: Array<Column<D>>;
  data: Array<D>;
  onRowClick?: (row: Row<D>) => void;
  renderExpandedArea?: (row: D) => JSX.Element;
};

export default function Table<D extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  renderExpandedArea,
}: Props<D>): ReactElement {
  const { getTableBodyProps, getTableProps, headerGroups, prepareRow, rows } =
    useTable(
      {
        columns,
        data,
      },
      useExpanded
    );

  // Render the UI for your table
  return (
    <div className={styles.tableWrapper}>
      <table {...getTableProps({ className: styles.table })}>
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={`headerGroups-row-${index}`}
            >
              {headerGroup.headers.map(
                (column: ExtendedHeaderGroup<D>, index) => {
                  const { style, className } = column;
                  return (
                    <th
                      {...column.getHeaderProps()}
                      {...{
                        style,
                        className,
                        'aria-hidden': column['aria-hidden'],
                      }}
                      key={`table-header-col-${index}`}
                    >
                      <>{column.render('Header')}</>
                    </th>
                  );
                }
              )}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row: ExtendedRow<D>, index) => {
            prepareRow(row);

            const handleClick = (event: React.MouseEvent) => {
              const element = event.target as HTMLElement;
              if (
                element.tagName === 'TD' &&
                event.currentTarget.contains(element) &&
                onRowClick
              ) {
                onRowClick(row);
              }
            };

            const handleKeyDown = (
              event: React.KeyboardEvent<HTMLTableRowElement>
            ) => {
              if (
                event.target === event.currentTarget &&
                event.key === 'Enter' &&
                onRowClick
              ) {
                onRowClick(row);
              }
            };

            return (
              <React.Fragment key={row.getRowProps().key}>
                <tr
                  {...row.getRowProps()}
                  className={classNames({
                    [styles.clickableRow]: onRowClick,
                    [styles.expandedRow]: row.isExpanded,
                  })}
                  onClick={handleClick}
                  onKeyDown={handleKeyDown}
                  tabIndex={onRowClick ? 0 : -1}
                  key={`table-body-row-${index}`}
                >
                  {row.cells.map((cell: ExtendedCell<D>, index) => {
                    const { className, style } = cell.column;
                    return (
                      <td
                        {...cell.getCellProps()}
                        {...{
                          className,
                          style,
                          'aria-hidden': cell.column['aria-hidden'],
                        }}
                        key={`table-body-col-${index}`}
                      >
                        <>{cell.render('Cell')}</>
                      </td>
                    );
                  })}
                </tr>
                {row.isExpanded && (
                  <tr className={styles.expandedArea}>
                    <td colSpan={row.cells.length}>
                      {renderExpandedArea && renderExpandedArea(row.original)}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
