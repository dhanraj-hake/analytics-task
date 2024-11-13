import React from 'react';
import { Table } from '@mantine/core';

interface DataTableProps {
  columns: string[]; 
  rows: any[]; 
  headings: string[];
}

const DataTable: React.FC<DataTableProps> = ({ headings ,columns, rows }) => {
  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr >
          {headings.map((column, index) => (
            <Table.Th style={{ textAlign: 'center' }} key={index}>{column}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rows.map((row, rowIndex) => (
          <Table.Tr key={rowIndex}>
            {columns.map((column, colIndex) => (
              <Table.Td key={colIndex}>
                {row[column]}
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

export default DataTable;
