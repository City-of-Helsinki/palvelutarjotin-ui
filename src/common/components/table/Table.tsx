import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table';
import classNames from 'classnames';
import React, { ReactElement } from 'react';

import styles from './table.module.scss';

type Props<D extends Record<string, unknown>> = {
  columns: ColumnDef<D>[];
  data: D[];
  onRowClick?: (row: Row<D>) => void;
  renderExpandedArea?: (row: D) => React.ReactNode;
};

export default function Table<D extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  renderExpandedArea,
}: Props<D>): ReactElement {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta;
                return (
                  <th
                    key={header.id}
                    style={meta?.style}
                    className={meta?.className}
                    aria-hidden={meta?.['aria-hidden']}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
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
              <React.Fragment key={row.id}>
                <tr
                  className={classNames({
                    [styles.clickableRow]: onRowClick,
                    [styles.expandedRow]: row.getIsExpanded(),
                  })}
                  onClick={handleClick}
                  onKeyDown={handleKeyDown}
                  tabIndex={onRowClick ? 0 : -1}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta;
                    return (
                      <td
                        key={cell.id}
                        className={meta?.className}
                        style={meta?.style}
                        aria-hidden={meta?.['aria-hidden']}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
                {row.getIsExpanded() && (
                  <tr className={styles.expandedArea}>
                    <td colSpan={row.getVisibleCells().length}>
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
