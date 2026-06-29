'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedItems } from '@/store/selectedItemsSlice';
import { exportCsvAction, ExportCsvState } from '@/app/actions/exportCsv';

const initialState: ExportCsvState = { csvContent: null, error: null };

export const ExportCsvForm = () => {
  const selectedItems = useSelector(selectSelectedItems);
  const [state, formAction, isPending] = useActionState(
    exportCsvAction,
    initialState
  );
  const downloadedRef = useRef<string | null>(null);

  useEffect(() => {
    if (state.csvContent && state.csvContent !== downloadedRef.current) {
      downloadedRef.current = state.csvContent;
      const blob = new Blob([state.csvContent], {
        type: 'text/csv;charset=utf-8',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'selected-books.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  }, [state.csvContent]);

  if (selectedItems.length === 0) {
    return <p>No items selected for export</p>;
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="items" value={JSON.stringify(selectedItems)} />
      <button type="submit" disabled={isPending} className="export-csv-button">
        {isPending
          ? 'Exporting...'
          : `Export Selected Books (${selectedItems.length}) to CSV`}
      </button>
      {state.error && <p className="error-message">{state.error}</p>}
    </form>
  );
};
