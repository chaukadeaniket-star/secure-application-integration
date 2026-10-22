import { randomUUID } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import { extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';

const uploadDirectory = fileURLToPath(new URL('../../uploads/', import.meta.url));
const maxFileSize = 10 * 1024 * 1024;
const allowedTypes = new Map([
  ['.pdf', new Set(['application/pdf'])],
  ['.zip', new Set(['application/zip', 'application/x-zip-compressed'])],
  ['.txt', new Set(['text/plain'])],
  ['.json', new Set(['application/json'])],
  ['.png', new Set(['image/png'])],
  ['.jpg', new Set(['image/jpeg'])],
  ['.jpeg', new Set(['image/jpeg'])]
]);

const storage = multer.diskStorage({
  destination(req, file, callback) {
    mkdir(uploadDirectory, { recursive: true })
      .then(() => callback(null, uploadDirectory))
      .catch(callback);
  },
  filename(req, file, callback) {
    callback(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`);
  }
});

function fileFilter(req, file, callback) {
  const extension = extname(file.originalname).toLowerCase();
  const matchingMimeTypes = allowedTypes.get(extension);
  if (!matchingMimeTypes || !matchingMimeTypes.has(file.mimetype)) {
    const error = new Error('Upload a PDF, ZIP, TXT, JSON, PNG, or JPEG file.');
    error.statusCode = 400;
    callback(error);
    return;
  }
  callback(null, true);
}

export const submissionUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxFileSize, files: 5, fields: 2, parts: 7 }
}).array('files', 5);
