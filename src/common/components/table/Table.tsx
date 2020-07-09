import classNames from 'classnames';
import React, { ReactElement } from 'react';
import { Column, Row, useTable, useExpanded } from 'react-table';

import styles from './table.module.scss';
import { ExtendedHeaderGroup, ExtendedCell } from './types';

type Props<D extends Record<string, unknown>> = {
  columns: Array<Column<D>>;
  data: Array<D>;
  onRowClick?: (row: Row<D>) => void;
};

export default function Table<D extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
}: Props<D>): ReactElement {
  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    prepareRow,
    rows,
  } = useTable(
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
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: ExtendedHeaderGroup<D>) => {
                const { style, className } = column;
                return (
                  <th {...column.getHeaderProps()} {...{ style, className }}>
                    {column.render('Header')}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
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
              <tr
                {...row.getRowProps()}
                className={classNames({ [styles.clickableRow]: onRowClick })}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                tabIndex={onRowClick ? 0 : -1}
              >
                {row.cells.map((cell: ExtendedCell<D>) => {
                  const { className, style } = cell.column;
                  return (
                    <td {...cell.getCellProps()} {...{ className, style }}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
