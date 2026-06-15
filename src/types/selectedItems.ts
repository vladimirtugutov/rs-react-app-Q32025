export type SelectedItem = {
  id: string;
  title: string;
  authors?: string[];
  description?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  thumbnail?: string;
  previewLink?: string;
};

export type SelectedItemsState = {
  items: SelectedItem[];
};
