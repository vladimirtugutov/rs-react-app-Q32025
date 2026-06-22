'use server';

import { SelectedItem } from '@/types/selectedItems';

export type ExportCsvState = {
  csvContent: string | null;
  error: string | null;
};

function generateCsv(items: SelectedItem[]): string {
  const headers = [
    'Title',
    'Authors',
    'Description',
    'Published Date',
    'Categories',
  ];

  const csvRows = [
    headers.join(','),
    ...items.map((item) =>
      [
        `"${item.title?.replace(/"/g, '""') || ''}"`,
        `"${item.authors?.join('; ') || ''}"`,
        `"${item.description?.replace(/"/g, '""') || ''}"`,
        `"${item.publishedDate || ''}"`,
        `"${item.categories?.join('; ') || ''}"`,
      ].join(',')
    ),
  ];

  return csvRows.join('\n');
}

export async function exportCsvAction(
  _prevState: ExportCsvState,
  formData: FormData
): Promise<ExportCsvState> {
  try {
    const itemsJson = formData.get('items') as string;
    const items: SelectedItem[] = JSON.parse(itemsJson);

    if (!items.length) {
      return { csvContent: null, error: 'No items selected for export' };
    }

    const csvContent = generateCsv(items);
    return { csvContent, error: null };
  } catch {
    return { csvContent: null, error: 'Failed to generate CSV' };
  }
}
