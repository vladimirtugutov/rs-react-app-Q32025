type Props = { year: number; onChange: (y: number) => void };

export const YearSelector = ({ year, onChange }: Props) => {
  const years = Array.from({ length: 2024 - 1750 + 1 }, (_, i) => 1750 + i);
  return (
    <select value={year} onChange={(e) => onChange(Number(e.target.value))}>
      {years.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  );
};
