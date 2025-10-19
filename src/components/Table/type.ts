import React from 'react';

export type Order = 'asc' | 'desc';

export interface BaseTableData {
  id: string | number;
  [key: string]: string | number | boolean;
}

export interface HeadCell<T extends BaseTableData> {
  disablePadding: boolean;
  id: keyof T;
  label: string;
  numeric: boolean;
  sortable?: boolean;
}

export interface TableColumn<T extends BaseTableData> extends HeadCell<T> {
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: number | string;
  maxWidth?: number | string;
  minWidth?: number | string;
  align?: 'left' | 'center' | 'right';
}

export interface EnhancedTableProps<T extends BaseTableData> {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: keyof T;
  rowCount: number;
  columns: TableColumn<T>[];
}

export interface EnhancedTableToolbarProps {
  numSelected: number;
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  onAdd?: () => void;
  onDelete?: () => void;
  showAdd?: boolean;
  showFilter?: boolean;
  filterComponent?: React.ReactNode;
}

export interface TableConfig<T extends BaseTableData> {
  columns: TableColumn<T>[];
  title: string;
  searchFields: (keyof T)[];
  defaultOrderBy: keyof T;
  showAdd?: boolean;
  showFilter?: boolean;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (ids: readonly (string | number)[]) => void;
  filterComponent?: React.ReactNode;
} 