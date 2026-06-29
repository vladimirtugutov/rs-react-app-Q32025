'use client';
import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  selectSelectedItemsCount,
  clearAllItems,
} from '../store/selectedItemsSlice';
import { ExportCsvForm } from './ExportCsvForm';

export const SelectedItemsFlyout: React.FC = () => {
  const selectedCount = useAppSelector(selectSelectedItemsCount);
  const dispatch = useAppDispatch();

  if (selectedCount === 0) {
    return null;
  }

  const handleUnselectAll = () => {
    dispatch(clearAllItems());
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
        </div>
        <div className="export-section">
          <ExportCsvForm />
        </div>
      </div>
    </div>
  );
};
