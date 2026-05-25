import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Pagination } from './Pagination';

vi.mock('../utils/pagination', () => ({
  getVisiblePages: vi.fn(() => [1, '...', 5]),
}));

describe('Pagination Interactivity', () => {
  it('should call onPageChange with correct values when buttons are clicked', () => {
    const mockOnPageChange = vi.fn();

    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(2);

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(4);

    const pageOneButton = screen.getByRole('button', { name: '1' });
    fireEvent.click(pageOneButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);

    const dotsButton = screen.getByRole('button', { name: '...' });
    fireEvent.click(dotsButton);
    expect(mockOnPageChange).toHaveBeenCalledTimes(3);
  });
});
