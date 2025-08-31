import { useState, useCallback, memo } from 'react';
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

const ColumnsModalComponent = ({ selected, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  const handleToggleColumn = useCallback(
    (key: ColumnKey) => {
      onChange(
        selected.includes(key)
          ? selected.filter((k) => k !== key)
          : [...selected, key]
      );
    },
    [selected, onChange]
  );

  return (
    <>
      <button onClick={handleOpen}>Select Columns</button>

      {isOpen && (
        <div className="modal-backdrop" onClick={handleClose}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Select Columns to Display</h3>
            {DEFAULT_CHOICES.map((key) => (
              <label key={key} className="column-checkbox">
                <input
                  type="checkbox"
                  checked={selected.includes(key)}
                  onChange={() => handleToggleColumn(key)}
                />
                {key.replace(/_/g, ' ')}
              </label>
            ))}
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export const ColumnsModal = memo(ColumnsModalComponent);
