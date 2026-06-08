import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  compressImage,
  validateImageFile,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
} from './imageUtils';

describe('imageUtils', () => {
  describe('validateImageFile', () => {
    it('should return null for valid PNG file', () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      expect(validateImageFile(file)).toBeNull();
    });

    it('should return null for valid JPEG file', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      expect(validateImageFile(file)).toBeNull();
    });

    it('should return error for invalid file type', () => {
      const file = new File(['test'], 'test.gif', { type: 'image/gif' });
      expect(validateImageFile(file)).toBe(
        'Invalid file type! Only PNG and JPEG allowed.'
      );
    });

    it('should return error for file exceeding max size', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: MAX_IMAGE_SIZE + 1 });
      expect(validateImageFile(file)).toBe(
        'File size too large! Maximum 5MB allowed.'
      );
    });

    it('should return null for file exactly at max size', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(file, 'size', { value: MAX_IMAGE_SIZE });
      expect(validateImageFile(file)).toBeNull();
    });

    it('should have correct allowed types', () => {
      expect(ALLOWED_IMAGE_TYPES).toContain('image/png');
      expect(ALLOWED_IMAGE_TYPES).toContain('image/jpeg');
    });

    it('should have correct max size', () => {
      expect(MAX_IMAGE_SIZE).toBe(5 * 1024 * 1024);
    });
  });

  describe('compressImage', () => {
    beforeEach(() => {
      const mockCanvas = {
        getContext: vi.fn(() => ({
          drawImage: vi.fn(),
        })),
        toDataURL: vi.fn(() => 'data:image/jpeg;base64,compressed'),
        width: 0,
        height: 0,
      };

      vi.spyOn(document, 'createElement').mockImplementation((tag) => {
        if (tag === 'canvas') return mockCanvas as unknown as HTMLElement;
        return document.createElement(tag);
      });
    });

    it('should resolve with compressed base64 string', async () => {
      const mockImage = {
        onload: null as (() => void) | null,
        onerror: null as (() => void) | null,
        src: '',
        width: 600,
        height: 400,
      };

      vi.spyOn(window, 'Image').mockImplementation(() => {
        setTimeout(() => mockImage.onload?.(), 0);
        return mockImage as unknown as HTMLImageElement;
      });

      const result = await compressImage('data:image/jpeg;base64,test');
      expect(result).toBe('data:image/jpeg;base64,compressed');
    });

    it('should reject when image fails to load', async () => {
      const mockImage = {
        onload: null as (() => void) | null,
        onerror: null as (() => void) | null,
        src: '',
      };

      vi.spyOn(window, 'Image').mockImplementation(() => {
        setTimeout(() => mockImage.onerror?.(), 0);
        return mockImage as unknown as HTMLImageElement;
      });

      await expect(compressImage('invalid-base64')).rejects.toThrow(
        'Failed to load image'
      );
    });

    it('should reject when canvas context is not available', async () => {
      const mockCanvas = {
        getContext: vi.fn(() => null),
        width: 0,
        height: 0,
      };

      vi.spyOn(document, 'createElement').mockImplementation((tag) => {
        if (tag === 'canvas') return mockCanvas as unknown as HTMLElement;
        return document.createElement(tag);
      });

      const mockImage = {
        onload: null as (() => void) | null,
        onerror: null as (() => void) | null,
        src: '',
        width: 100,
        height: 100,
      };

      vi.spyOn(window, 'Image').mockImplementation(() => {
        setTimeout(() => mockImage.onload?.(), 0);
        return mockImage as unknown as HTMLImageElement;
      });

      await expect(
        compressImage('data:image/jpeg;base64,test')
      ).rejects.toThrow('Canvas 2D context is not supported');
    });
  });
});
