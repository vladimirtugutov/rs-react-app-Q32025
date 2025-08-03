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

  const handleDownload = () => {
    const csvContent = generateCSV(selectedItems);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedCount}_items.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    const csvRows = [
      headers.join(','),
      ...items.map((item) =>
        [
          `"${item.title?.replace(/"/g, '""') || ''}"`,
          `"${item.authors?.join('; ') || ''}"`,
          `"${item.description?.replace(/"/g, '""') || ''}"`,
          `"${item.publishedDate || ''}"`,
          `"${item.pageCount || ''}"`,
          `"${item.categories?.join('; ') || ''}"`,
          `"${item.previewLink || ''}"`,
        ].join(',')
      ),
    ];
    return csvRows.join('\n');
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
