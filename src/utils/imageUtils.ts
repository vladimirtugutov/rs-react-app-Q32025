export const compressImage = (
  base64: string,
  maxWidth: number = 300,
  quality: number = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas 2D context is not supported'));
        return;
      }

      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = base64;
  });
};

export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg'];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export const validateImageFile = (file: File): string | null => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Invalid file type! Only PNG and JPEG allowed.';
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return 'File size too large! Maximum 5MB allowed.';
  }
  return null;
};
