import type { ColumnKey, OwidYearRow } from '../../types/owid';

type Props = {
  data: OwidYearRow[];
  selectedColumns: ColumnKey[];
};

export const YearlyTable = ({ data, selectedColumns }: Props) => {
  const columns: ColumnKey[] = [
    'year',
    ...selectedColumns.filter((c) => c !== 'year'),
  ];

  return (
    <table className="yearly-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{col.replace(/_/g, ' ')}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.year}>
            {columns.map((col) => {
              const v = row[col as keyof OwidYearRow];
              return (
                <td key={col}>
                  {typeof v === 'number' ? v.toLocaleString() : (v ?? 'N/A')}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
