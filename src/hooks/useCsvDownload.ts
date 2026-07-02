'use client';
import { useEffect, useRef } from 'react';

export function useCsvDownload(csvContent: string | null) {
  const downloadedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!csvContent || csvContent === downloadedRef.current) return;

    downloadedRef.current = csvContent;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'selected-books.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, [csvContent]);
}
