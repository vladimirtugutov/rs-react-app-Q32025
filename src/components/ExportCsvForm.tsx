'use client';

import { useSelector } from 'react-redux';
import { selectSelectedItems } from '@/store/selectedItemsSlice';
import { useState } from 'react';

export const ExportCsvForm = () => {
  const selectedItems = useSelector(selectSelectedItems);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (selectedItems.length === 0) return;

    setIsExporting(true);

    try {
      const response = await fetch('/api/export-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: selectedItems }),
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'selected-books.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  if (selectedItems.length === 0) {
    return <p>No items selected for export</p>;
  }

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="export-csv-button"
    >
      {isExporting
        ? 'Exporting...'
        : `Export Selected Books (${selectedItems.length}) to CSV`}
    </button>
  );
};
