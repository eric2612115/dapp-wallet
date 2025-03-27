// components/ui/Table.tsx
import React from 'react';
import clsx from 'clsx';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div className="relative overflow-x-auto shadow-sm rounded-lg border border-warm-divider dark:border-dark-100">
        <table
          ref={ref}
          className={clsx(
            'w-full text-sm text-left',
            className
          )}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={clsx(
          'text-xs uppercase bg-warm-paper dark:bg-dark-200 text-warm-textSecondary dark:text-gray-400',
          className
        )}
        {...props}
      >
        {children}
      </thead>
    );
  }
);

TableHeader.displayName = 'TableHeader';

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        className={clsx(
          'bg-warm-paper dark:bg-dark-200 divide-y divide-warm-divider dark:divide-dark-100',
          className
        )}
        {...props}
      >
        {children}
      </tbody>
    );
  }
);

TableBody.displayName = 'TableBody';

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={clsx(
          'hover:bg-warm-bg dark:hover:bg-dark-100',
          className
        )}
        {...props}
      >
        {children}
      </tr>
    );
  }
);

TableRow.displayName = 'TableRow';

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={clsx(
          'px-6 py-4 text-warm-text dark:text-gray-200',
          className
        )}
        {...props}
      >
        {children}
      </td>
    );
  }
);

TableCell.displayName = 'TableCell';

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={clsx(
          'px-6 py-3 font-medium text-xs uppercase tracking-wider',
          className
        )}
        {...props}
      >
        {children}
      </th>
    );
  }
);

TableHead.displayName = 'TableHead';

interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <tfoot
        ref={ref}
        className={clsx(
          'bg-warm-paper dark:bg-dark-200 border-t border-warm-divider dark:border-dark-100',
          className
        )}
        {...props}
      >
        {children}
      </tfoot>
    );
  }
);

TableFooter.displayName = 'TableFooter';

export { Table, TableHeader, TableBody, TableRow, TableCell, TableHead, TableFooter };