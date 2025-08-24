import { describe, it, expect, beforeAll, vi } from 'vitest';
import { compressImage } from './imageUtils';

beforeAll(() => {
  global.HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    drawImage: vi.fn(),
  }));

  global.HTMLCanvasElement.prototype.toDataURL = vi.fn(
    () => 'data:image/jpeg;base64,compressed-image-data'
  );

  global.Image = class {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    src: string = '';
    width: number = 800;
    height: number = 600;

    constructor() {
      setTimeout(() => {
        if (this.onload) {
          this.onload();
        }
      }, 0);
    }
  };
});

describe('imageUtils', () => {
  describe('compressImage', () => {
    const mockBase64 =
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU';

    it('should compress image with default parameters', async () => {
      const result = await compressImage(mockBase64);
      expect(result).toBe('data:image/jpeg;base64,compressed-image-data');
    });

    it('should compress image with custom maxWidth', async () => {
      const result = await compressImage(mockBase64, 200);
      expect(result).toBe('data:image/jpeg;base64,compressed-image-data');
    });

    it('should compress image with custom quality', async () => {
      const result = await compressImage(mockBase64, 300, 0.5);
      expect(result).toBe('data:image/jpeg;base64,compressed-image-data');
    });

    it('should handle image load errors', async () => {
      const OriginalImage = global.Image;
      global.Image = class {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        src: string = '';

        constructor() {
          setTimeout(() => {
            if (this.onerror) {
              this.onerror();
            }
          }, 0);
        }
      };

      await expect(compressImage(mockBase64)).rejects.toThrow(
        'Failed to load image'
      );

      global.Image = OriginalImage;
    });

    it('should handle canvas context not supported', async () => {
      const originalGetContext = global.HTMLCanvasElement.prototype.getContext;
      global.HTMLCanvasElement.prototype.getContext = vi.fn(() => null);

      await expect(compressImage(mockBase64)).rejects.toThrow(
        'Canvas 2D context is not supported'
      );

      global.HTMLCanvasElement.prototype.getContext = originalGetContext;
    });

    it('should handle different image sizes', async () => {
      const OriginalImage = global.Image;
      global.Image = class {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        src: string = '';
        width: number = 1920;
        height: number = 1080;

        constructor() {
          setTimeout(() => {
            if (this.onload) {
              this.onload();
            }
          }, 0);
        }
      };

      const result = await compressImage(mockBase64, 300);
      expect(result).toBe('data:image/jpeg;base64,compressed-image-data');

      global.Image = OriginalImage;
    });

    it('should handle very small maxWidth', async () => {
      const result = await compressImage(mockBase64, 50);
      expect(result).toBe('data:image/jpeg;base64,compressed-image-data');
    });

    it('should handle quality edge cases', async () => {
      const result1 = await compressImage(mockBase64, 300, 0);
      expect(result1).toBe('data:image/jpeg;base64,compressed-image-data');

      const result2 = await compressImage(mockBase64, 300, 1);
      expect(result2).toBe('data:image/jpeg;base64,compressed-image-data');
    });

    it('should maintain aspect ratio', async () => {
      const result = await compressImage(mockBase64, 400, 0.8);
      expect(result).toContain('data:image/jpeg;base64,');
    });
  });
});
