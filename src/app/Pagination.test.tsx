import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Pagination } from './Pagination';

vi.mock('../utils/pagination', () => ({
  getVisiblePages: vi.fn(),
}));

describe('Pagination', async () => {
  const mockOnPageChange = vi.fn();
  const { getVisiblePages } = await import('../utils/pagination');

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should render Previous and Next buttons', () => {
      vi.mocked(getVisiblePages).mockReturnValue([1, 2, 3]);

      render(
        <Pagination
          currentPage={2}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('should render page number buttons', () => {
      vi.mocked(getVisiblePages).mockReturnValue([1, 2, 3]);

      render(
        <Pagination
          currentPage={2}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should mark current page as active', () => {
      vi.mocked(getVisiblePages).mockReturnValue([1, 2, 3]);

      render(
        <Pagination
          currentPage={2}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      const currentPageButton = screen.getByText('2');
      expect(currentPageButton).toHaveClass('active');
    });
  });

  describe('Previous Button', () => {
    it('should call onPageChange with previous page when Previous is clicked', () => {
      vi.mocked(getVisiblePages).mockReturnValue([1, 2, 3]);

      render(
        <Pagination
          currentPage={2}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      fireEvent.click(screen.getByText('Previous'));
      expect(mockOnPageChange).toHaveBeenCalledWith(1);
    });

    it('should disable Previous button on first page', () => {
      vi.mocked(getVisiblePages).mockReturnValue([1, 2, 3]);

      render(
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      const previousButton = screen.getByText('Previous');
      expect(previousButton).toBeDisabled();
    });

    it('should enable Previous button when not on first page', () => {
      vi.mocked(getVisiblePages).mockReturnValue([1, 2, 3]);

      render(
        <Pagination
          currentPage={2}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      const previousButton = screen.getByText('Previous');
      expect(previousButton).not.toBeDisabled();
    });

    it('should stop event propagation on Previous click', () => {
      vi.mocked(getVisiblePages).mockReturnValue([1, 2, 3]);
      const mockStopPropagation = vi.fn();

      render(
        <Pagination
          currentPage={2}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      const previousButton = screen.getByText('Previous');
      fireEvent.click(previousButton, {
        stopPropagation: mockStopPropagation,
      });

      expect(mockOnPageChange).toHaveBeenCalledWith(1);
    });
  });

  describe('Next Button', () => {
    it('should call onPageChange with next page when Next is clicked', () => {
      vi.mocked(getVisiblePages).mockReturnValue([1, 2, 3]);

      render(
        <Pagination
          currentPage={2}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      fireEvent.click(screen.getByText('Next'));
      expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });

    it('should disable Next button on last page', () => {
      vi.mocked(getVisiblePages).mockReturnValue([1, 2, 3]);

      render(
        <Pagination
          currentPage={3}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByText('Next');
      expect(nextButton).toBeDisabled();
    });

    it('should enable Next button when not on last page', () => {
      vi.mocked(getVisiblePages).mockReturnValue([1, 2, 3]);

      render(
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByText('Next');
      expect(nextButton).not.toBeDisabled();
    });

    it('should stop event propagation on Next click', () => {
      vi.mocked(getVisiblePages).mockReturnValue([1, 2, 3]);
      const mockStopPropagation = vi.fn();

      render(
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton, {
        stopPropagation: mockStopPropagation,
      });

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });
  });

  describe('Page Number Buttons', () => {
    it('should call onPageChange when page number is clicked', () => {
      vi.mocked(getVisiblePages).mockReturnValue([1, 2, 3]);

      render(
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      fireEvent.click(screen.getByText('3'));
      expect(mockOnPageChange).toHaveBeenCalledWith(3);
    });

    it('should not call onPageChange when ellipsis is clicked', () => {
      vi.mocked(getVisiblePages).mockReturnValue([1, '...', 10]);

      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      fireEvent.click(screen.getByText('...'));
      expect(mockOnPageChange).not.toHaveBeenCalled();
    });

    it('should disable ellipsis buttons', () => {
      vi.mocked(getVisiblePages).mockReturnValue([1, '...', 10]);

      render(
        <Pagination
          currentPage={1}
          totalPages={10}
          onPageChange={mockOnPageChange}
        />
      );

      const ellipsisButton = screen.getByText('...');
      expect(ellipsisButton).toBeDisabled();
    });

    it('should not disable number buttons', () => {
      vi.mocked(getVisiblePages).mockReturnValue([1, 2, 3]);

      render(
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      const numberButton = screen.getByText('2');
      expect(numberButton).not.toBeDisabled();
    });

    it('should stop event propagation on page click', () => {
      vi.mocked(getVisiblePages).mockReturnValue([1, 2, 3]);
      const mockStopPropagation = vi.fn();

      render(
        <Pagination
          currentPage={1}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      const pageButton = screen.getByText('2');
      fireEvent.click(pageButton, {
        stopPropagation: mockStopPropagation,
      });

      expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle single page scenario', () => {
      vi.mocked(getVisiblePages).mockReturnValue([1]);

      render(
        <Pagination
          currentPage={1}
          totalPages={1}
          onPageChange={mockOnPageChange}
        />
      );

      const previousButton = screen.getByText('Previous');
      const nextButton = screen.getByText('Next');

      expect(previousButton).toBeDisabled();
      expect(nextButton).toBeDisabled();
    });

    it('should handle zero pages scenario', () => {
      vi.mocked(getVisiblePages).mockReturnValue([]);

      render(
        <Pagination
          currentPage={1}
          totalPages={0}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('should handle large page numbers', () => {
      vi.mocked(getVisiblePages).mockReturnValue([98, 99, 100]);

      render(
        <Pagination
          currentPage={99}
          totalPages={100}
          onPageChange={mockOnPageChange}
        />
      );

      fireEvent.click(screen.getByText('100'));
      expect(mockOnPageChange).toHaveBeenCalledWith(100);
    });

    it('should handle mixed visible pages with ellipsis', () => {
      vi.mocked(getVisiblePages).mockReturnValue([
        1,
        '...',
        5,
        6,
        7,
        '...',
        20,
      ]);

      render(
        <Pagination
          currentPage={6}
          totalPages={20}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getAllByText('...')).toHaveLength(2);
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();

      expect(screen.getByText('6')).toHaveClass('active');

      fireEvent.click(screen.getByText('5'));
      expect(mockOnPageChange).toHaveBeenCalledWith(5);

      fireEvent.click(screen.getAllByText('...')[0]);
      expect(mockOnPageChange).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid currentPage (less than 1)', () => {
      vi.mocked(getVisiblePages).mockReturnValue([1, 2, 3]);

      render(
        <Pagination
          currentPage={0}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      const previousButton = screen.getByText('Previous');
      expect(previousButton).not.toBeDisabled();
    });

    it('should handle invalid currentPage (greater than totalPages)', () => {
      vi.mocked(getVisiblePages).mockReturnValue([1, 2, 3]);

      render(
        <Pagination
          currentPage={5}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      const nextButton = screen.getByText('Next');
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('CSS Classes', () => {
    it('should apply correct CSS classes to pagination container', () => {
      vi.mocked(getVisiblePages).mockReturnValue([1, 2, 3]);

      const { container } = render(
        <Pagination
          currentPage={2}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      expect(container.firstChild).toHaveClass('pagination');
    });

    it('should not apply active class to non-current pages', () => {
      vi.mocked(getVisiblePages).mockReturnValue([1, 2, 3]);

      render(
        <Pagination
          currentPage={2}
          totalPages={3}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('1')).not.toHaveClass('active');
      expect(screen.getByText('3')).not.toHaveClass('active');
    });
  });

  describe('Integration with getVisiblePages', () => {
    it('should call getVisiblePages with correct parameters', () => {
      const mockGetVisiblePages = vi.mocked(getVisiblePages);
      mockGetVisiblePages.mockReturnValue([1, 2, 3]);

      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={mockOnPageChange}
        />
      );

      expect(mockGetVisiblePages).toHaveBeenCalledWith(2, 5);
    });

    it('should handle empty array from getVisiblePages', () => {
      vi.mocked(getVisiblePages).mockReturnValue([]);

      render(
        <Pagination
          currentPage={1}
          totalPages={0}
          onPageChange={mockOnPageChange}
        />
      );

      expect(screen.getByText('Previous')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();

      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });
  });
});
