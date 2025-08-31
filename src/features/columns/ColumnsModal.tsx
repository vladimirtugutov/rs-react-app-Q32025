import { useState } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Select Columns</button>

      {isOpen && (
        <div className="modal-backdrop" onClick={() => setIsOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Select Columns to Display</h3>
            {DEFAULT_CHOICES.map((key) => (
              <label key={key} className="column-checkbox">
                <input
                  type="checkbox"
                  checked={selected.includes(key)}
                  onChange={() => {
                    onChange(
                      selected.includes(key)
                        ? selected.filter((k) => k !== key)
                        : [...selected, key]
                    );
                  }}
                />
                {key.replace(/_/g, ' ')}
              </label>
            ))}
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};
