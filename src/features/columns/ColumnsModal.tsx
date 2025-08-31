import { useMemo } from 'react';
import type { ColumnKey } from '../../types/owid';

type Props = {
  selected: ColumnKey[];
  onChange: (cols: ColumnKey[]) => void;
};

const DEFAULT_CHOICES: ColumnKey[] = [
  'population',
  'co2',
  'co2_per_capita',
  'methane',
  'oil_co2',
  'temperature_change_from_co2',
];

export function ColumnsModal({ selected, onChange }: Props) {
  const choices = useMemo(() => DEFAULT_CHOICES, []);
  return (
    <div>
      {choices.map((key) => {
        const checked = selected.includes(key);
        return (
          <label key={key}>
            <input
              type="checkbox"
              checked={checked}
              onChange={() => {
                onChange(
                  checked
                    ? selected.filter((k) => k !== key)
                    : [...selected, key]
                );
              }}
            />
            {key}
          </label>
        );
      })}
    </div>
  );
}
