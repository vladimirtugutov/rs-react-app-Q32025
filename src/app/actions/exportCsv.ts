'use server';

import { SelectedItem } from '@/types/selectedItems';

export async function generateCsvAction(
  items: SelectedItem[]
): Promise<string> {
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

export async function downloadCsvAction(formData: FormData) {
  const itemsJson = formData.get('items') as string;
  const items: SelectedItem[] = JSON.parse(itemsJson);

  const csvContent = await generateCsvAction(items);

  return new Response(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="selected-books.csv"',
    },
  });
}
