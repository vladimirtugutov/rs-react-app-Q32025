import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

global.FileReader = class {
  result: string | null = null;
  onload: (() => void) | null = null;
  onloadend: (() => void) | null = null;

  readAsDataURL() {
    this.result = 'data:image/jpeg;base64,testbase64string';
    setTimeout(() => {
      if (this.onloadend) this.onloadend();
    }, 0);
  }
} as unknown as typeof FileReader;

global.File = class extends Blob {
  name: string;
  type: string;
  size: number;

  constructor(
    chunks: BlobPart[],
    filename: string,
    options: FilePropertyBag = {}
  ) {
    super(chunks);
    this.name = filename;
    this.type = options.type || '';
    this.size = options.size || 1024;
  }
} as unknown as typeof File;

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn(() => ({
    drawImage: vi.fn(),
    toDataURL: vi.fn(() => 'data:image/jpeg;base64,mock'),
  })),
});

Object.defineProperty(window, 'alert', {
  value: vi.fn(),
});
