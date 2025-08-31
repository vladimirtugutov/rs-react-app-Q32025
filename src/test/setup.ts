import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

globalThis.FileReader = class {
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

class MockFile extends Blob {
  readonly name: string;
  readonly type: string;
  readonly lastModified: number = Date.now();
  readonly webkitRelativePath: string = '';
  size: number = 1024;

  constructor(chunks: BlobPart[], filename: string, options?: FilePropertyBag) {
    super(chunks, options);
    this.name = filename;
    this.type = options?.type || '';
  }
}

globalThis.File = MockFile as unknown as typeof File;

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn(() => ({
    drawImage: vi.fn(),
    toDataURL: vi.fn(() => 'data:image/jpeg;base64,mock'),
  })),
});

Object.defineProperty(window, 'alert', {
  value: vi.fn(),
});
