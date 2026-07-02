'use client';
import { useActionState } from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedItems } from '@/store/selectedItemsSlice';
import { exportCsvAction, ExportCsvState } from '@/app/actions/exportCsv';
import { useCsvDownload } from '@/hooks/useCsvDownload';

const initialState: ExportCsvState = { csvContent: null, error: null };

export const ExportCsvForm = () => {
  const selectedItems = useSelector(selectSelectedItems);
  const [state, formAction, isPending] = useActionState(
    exportCsvAction,
    initialState
  );

  useCsvDownload(state.csvContent);

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
