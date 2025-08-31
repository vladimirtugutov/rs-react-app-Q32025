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

export const ColumnsModal = ({ selected, onChange }: Props) => {
  return (
    <>
      {DEFAULT_CHOICES.map((key) => {
        const checked = selected.includes(key);
        return (
          <label key={key} className="column-checkbox">
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
            {key.replace(/_/g, ' ')}
          </label>
        );
      })}
    </>
  );
};
