/**
 * Генерирует массив видимых страниц для пагинации с многоточиями
 * @param currentPage - текущая страница
 * @param totalPages - общее количество страниц
 * @param delta - количество страниц слева и справа от текущей (по умолчанию 2)
 * @returns массив номеров страниц и многоточий
 */
export const getVisiblePages = (
  currentPage: number,
  totalPages: number,
  delta: number = 2
): (number | string)[] => {
  if (totalPages <= 1) {
    return totalPages === 1 ? [1] : [];
  }

  const range: number[] = [];
  const rangeWithDots: (number | string)[] = [];

  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  if (currentPage - delta > 2) {
    rangeWithDots.push(1, '...');
  } else {
    rangeWithDots.push(1);
  }

  rangeWithDots.push(...range);

  if (currentPage + delta < totalPages - 1) {
    rangeWithDots.push('...', totalPages);
  } else if (totalPages > 1) {
    rangeWithDots.push(totalPages);
  }

  return rangeWithDots;
};
