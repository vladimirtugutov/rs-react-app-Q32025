import { describe, it, expect, vi } from 'vitest';
import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from './hooks';

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(() => vi.fn()),
  useSelector: vi.fn(),
}));

describe('hooks', () => {
  it('should call useDispatch when useAppDispatch is called', () => {
    useAppDispatch();
    expect(useDispatch).toHaveBeenCalled();
  });

  it('should return dispatch function from useAppDispatch', () => {
    const mockDispatch = vi.fn();
    vi.mocked(useDispatch).mockReturnValue(mockDispatch);

    const dispatch = useAppDispatch();
    expect(dispatch).toBe(mockDispatch);
  });

  it('should be useSelector when useAppSelector is called', () => {
    const mockSelector = vi.fn();
    const mockState = {
      form: { formData: [], highlightedId: null },
      countries: [],
    };
    vi.mocked(useSelector).mockImplementation((selector) =>
      selector(mockState)
    );

    useAppSelector(mockSelector);
    expect(mockSelector).toHaveBeenCalledWith(mockState);
  });
});
