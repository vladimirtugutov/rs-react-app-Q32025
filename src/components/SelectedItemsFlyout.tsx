import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  selectSelectedItems,
  selectSelectedItemsCount,
  clearAllItems,
} from '../store/selectedItemsSlice';

export const SelectedItemsFlyout: React.FC = () => {
  const selectedItems = useAppSelector(selectSelectedItems);
  const selectedCount = useAppSelector(selectSelectedItemsCount);
  const dispatch = useAppDispatch();

  if (selectedCount === 0) {
    return null;
  }

  const handleUnselectAll = () => {
    dispatch(clearAllItems());
  };

  const generateCSV = (items: typeof selectedItems) => {
    const headers = [
      'Title',
      'Authors',
      'Description',
      'Published Date',
      'Page Count',
      'Categories',
      'Preview Link',
    ];

    const cleanField = (field: string | number | undefined | null): string => {
      if (field === undefined || field === null) return '""';

      const cleanText = String(field)
        .replace(/[\n\r]+/g, ' ')
        .replace(/"/g, '""');

      return `"${cleanText}"`;
    };

    const csvRows = [
      headers.join(','),
      ...items.map((item) =>
        [
          cleanField(item.title),
          cleanField(item.authors?.join('; ')),
          cleanField(item.description),
          cleanField(item.publishedDate),
          cleanField(item.pageCount),
          cleanField(item.categories?.join('; ')),
          cleanField(item.previewLink),
        ].join(',')
      ),
    ];

    return csvRows.join('\n');
  };

  const handleDownload = () => {
    try {
      const csvContent = generateCSV(selectedItems);
      const blob = new Blob(['\uFEFF' + csvContent], {
        type: 'text/csv;charset=utf-8;',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedCount}_items.csv`);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      void error;
    }
  };

  return (
    <div className="selected-items-flyout">
      <div className="flyout-content">
        <span className="selected-count">
          {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
        </span>
        <div className="flyout-actions">
          <button onClick={handleUnselectAll} className="unselect-btn">
            Unselect all
          </button>
          <button onClick={handleDownload} className="download-btn">
            Download
          </button>
        </div>
      </div>
    </div>
  );
};
