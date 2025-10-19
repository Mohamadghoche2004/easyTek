import React from 'react';
import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import { visuallyHidden } from '@mui/utils';
import { EnhancedTableProps, BaseTableData } from './type';

export default function GenericTableHead<T extends BaseTableData>(props: EnhancedTableProps<T>) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, columns } = props;
  
  const createSortHandler = (property: keyof T) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all items',
            }}
          />
        </TableCell>
        {columns.map((column) => (
          <TableCell
            key={String(column.id)}
            align={column.align || (column.numeric ? 'right' : 'left')}
            padding={column.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === column.id ? order : false}
            sx={{ 
              width: column.width,
              maxWidth: column.maxWidth,
              minWidth: column.minWidth
            }}
          >
            {column.sortable !== false ? (
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc'}
                onClick={createSortHandler(column.id)}
              >
                {column.label}
                {orderBy === column.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              column.label
            )}
          </TableCell>
        ))}
        <TableCell 
          align="center"
          sx={{ 
            position: 'sticky', 
            right: 0, 
            backgroundColor: 'background.paper',
            zIndex: 1,
            width: '90px',
            maxWidth: '90px',
            minWidth: '90px',
            borderLeft: '1px solid',
            borderLeftColor: 'divider'
          }}
        >
          Actions
        </TableCell>
      </TableRow>
    </TableHead>
  );
} 