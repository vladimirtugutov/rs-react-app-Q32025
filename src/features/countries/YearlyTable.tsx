import { memo } from 'react';
import type { ColumnKey, OwidYearRow } from '../../types/owid';

type Props = {
  data: OwidYearRow[];
  selectedColumns: ColumnKey[];
};

export const YearlyTable = memo(function YearlyTable({
  data,
  selectedColumns,
}: Props) {
  const columns: ColumnKey[] = [
    'year',
    ...selectedColumns.filter((c) => c !== 'year'),
  ];

  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.year}>
            {columns.map((col) => {
              const v = row[col as keyof OwidYearRow];
              return <td key={col}>{v ?? 'N/A'}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
});
