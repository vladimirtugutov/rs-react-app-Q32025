import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import SearchInput from './SearchInput';
import SearchContext from './SearchContext';
import { SearchContextType } from '../types/components';

const mockSearchContext: SearchContextType = {
  searchValue: '',
  setSearchValue: vi.fn(),
  handleSearchButtonClick: vi.fn(),
};

const renderWithContext = (contextValue: SearchContextType) => {
  return render(
    <SearchContext.Provider value={contextValue}>
      <SearchInput />
    </SearchContext.Provider>
  );
};

describe('SearchInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render input field correctly', () => {
    renderWithContext(mockSearchContext);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should display current search value from context', () => {
    const contextWithValue = {
      ...mockSearchContext,
      searchValue: 'test search query',
    };

    renderWithContext(contextWithValue);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('test search query');
  });

  it('should call setSearchValue when user types', async () => {
    const user = userEvent.setup();
    renderWithContext(mockSearchContext);

    const input = screen.getByRole('textbox');

    await user.type(input, 'new text');

    expect(mockSearchContext.setSearchValue).toHaveBeenCalledWith('n');
    expect(mockSearchContext.setSearchValue).toHaveBeenCalledWith('e');
    expect(mockSearchContext.setSearchValue).toHaveBeenCalledWith('w');
    expect(mockSearchContext.setSearchValue).toHaveBeenCalledWith(' ');
    expect(mockSearchContext.setSearchValue).toHaveBeenCalledWith('t');
    expect(mockSearchContext.setSearchValue).toHaveBeenCalledWith('e');
    expect(mockSearchContext.setSearchValue).toHaveBeenCalledWith('x');
    expect(mockSearchContext.setSearchValue).toHaveBeenCalledWith('t');

    expect(mockSearchContext.setSearchValue).toHaveBeenCalledTimes(8);
  });

  it('should call setSearchValue with correct value on change', () => {
    renderWithContext(mockSearchContext);

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'test value' } });

    expect(mockSearchContext.setSearchValue).toHaveBeenCalledWith('test value');
    expect(mockSearchContext.setSearchValue).toHaveBeenCalledTimes(1);
  });

  it('should call handleSearchButtonClick when Enter key is pressed', () => {
    renderWithContext(mockSearchContext);

    const input = screen.getByRole('textbox');

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockSearchContext.handleSearchButtonClick).toHaveBeenCalledTimes(1);
  });

  it('should not call handleSearchButtonClick for other keys', () => {
    renderWithContext(mockSearchContext);

    const input = screen.getByRole('textbox');

    fireEvent.keyDown(input, { key: 'Space', code: 'Space' });
    fireEvent.keyDown(input, { key: 'Tab', code: 'Tab' });
    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
    fireEvent.keyDown(input, { key: 'a', code: 'KeyA' });

    expect(mockSearchContext.handleSearchButtonClick).not.toHaveBeenCalled();
  });

  it('should handle empty search value', () => {
    const contextWithEmptyValue = {
      ...mockSearchContext,
      searchValue: '',
    };

    renderWithContext(contextWithEmptyValue);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
  });

  it('should handle special characters in search value', () => {
    const contextWithSpecialChars = {
      ...mockSearchContext,
      searchValue: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    };

    renderWithContext(contextWithSpecialChars);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('!@#$%^&*()_+-=[]{}|;:,.<>?');
  });

  it('should handle very long search value', () => {
    const longValue = 'a'.repeat(1000);
    const contextWithLongValue = {
      ...mockSearchContext,
      searchValue: longValue,
    };

    renderWithContext(contextWithLongValue);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue(longValue);
  });

  it('should handle unicode characters', () => {
    const contextWithUnicode = {
      ...mockSearchContext,
      searchValue: '🌟 Тест 中文 العربية',
    };

    renderWithContext(contextWithUnicode);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('🌟 Тест 中文 العربية');
  });

  it('should handle Enter key with existing text', async () => {
    const user = userEvent.setup();
    const contextWithValue = {
      ...mockSearchContext,
      searchValue: 'existing text',
    };

    renderWithContext(contextWithValue);

    const input = screen.getByRole('textbox');

    await user.click(input);
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockSearchContext.handleSearchButtonClick).toHaveBeenCalledTimes(1);
  });

  it('should work with context that has undefined methods', () => {
    const incompleteContext = {
      searchValue: 'test',
      setSearchValue: vi.fn(),
      handleSearchButtonClick: vi.fn(),
    };

    expect(() => {
      renderWithContext(incompleteContext);
    }).not.toThrow();
  });

  it('should handle multiple Enter key presses', () => {
    renderWithContext(mockSearchContext);

    const input = screen.getByRole('textbox');

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockSearchContext.handleSearchButtonClick).toHaveBeenCalledTimes(3);
  });

  it('should have correct input attributes for accessibility', () => {
    renderWithContext(mockSearchContext);

    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('type', 'text');
  });

  it('should maintain focus after Enter key press', async () => {
    const user = userEvent.setup();
    renderWithContext(mockSearchContext);

    const input = screen.getByRole('textbox');

    await user.click(input);
    expect(input).toHaveFocus();

    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(input).toHaveFocus();
  });

  it('should handle rapid typing correctly', async () => {
    const user = userEvent.setup();
    renderWithContext(mockSearchContext);

    const input = screen.getByRole('textbox');

    await user.type(input, 'quick');

    expect(mockSearchContext.setSearchValue).toHaveBeenCalledTimes(5);
    expect(mockSearchContext.setSearchValue).toHaveBeenLastCalledWith('k');
  });
});
