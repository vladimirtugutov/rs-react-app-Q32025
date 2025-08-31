import { memo, useMemo } from 'react';
import type { ColumnKey, OwidYearRow } from '../../types/owid';

type Props = {
  data: OwidYearRow[];
  selectedColumns: ColumnKey[];
  highlightYear?: number;
};

const YearlyTableComponent = ({
  data,
  selectedColumns,
  highlightYear,
}: Props) => {
  const columns: ColumnKey[] = useMemo(
    () => ['year', ...selectedColumns.filter((c) => c !== 'year')],
    [selectedColumns]
  );

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
          <tr
            key={row.year}
            className={row.year === highlightYear ? 'highlight-year' : ''}
          >
            {columns.map((col) => {
              const v = row[col as keyof OwidYearRow];
              return (
                <td key={col}>
                  {typeof v === 'number' && col === 'year'
                    ? v.toString()
                    : typeof v === 'number'
                      ? v.toLocaleString()
                      : (v ?? 'N/A')}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const YearlyTable = memo(YearlyTableComponent);
