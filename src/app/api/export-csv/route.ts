import { NextRequest, NextResponse } from 'next/server';

type SelectedItem = {
  title?: string;
  authors?: string[];
  description?: string;
  publishedDate?: string;
  categories?: string[];
};

export async function POST(request: NextRequest) {
  try {
    const { items } = (await request.json()) as { items: SelectedItem[] };

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

    const csvContent = csvRows.join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="selected-books.csv"',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to generate CSV' },
      { status: 500 }
    );
  }
}
