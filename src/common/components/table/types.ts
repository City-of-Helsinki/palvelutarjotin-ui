import { RowData } from '@tanstack/react-table';
import React from 'react';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    'aria-hidden'?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }
}
