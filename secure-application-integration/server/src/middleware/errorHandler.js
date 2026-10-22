export function notFoundHandler(req, res) {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'The requested resource was not found.' },
    requestId: req.id
  });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  const errorStatus = error.statusCode ?? error.status;
  const isUploadError = error.name === 'MulterError';
  const uploadStatus = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
  const status = isUploadError
    ? uploadStatus
    : Number.isInteger(errorStatus) && errorStatus >= 400 && errorStatus < 500
      ? errorStatus
      : 500;
  if (status === 500) console.error(`[${req.id || 'no-request-id'}]`, error);
  const message = status === 500
    ? 'An unexpected server error occurred.'
    : isUploadError && error.code === 'LIMIT_FILE_SIZE'
      ? 'Each upload must be 10 MB or smaller.'
      : isUploadError && error.code === 'LIMIT_FILE_COUNT'
        ? 'Upload no more than 5 files.'
        : isUploadError
          ? 'The uploaded files could not be accepted.'
          : error.type === 'entity.parse.failed'
            ? 'Request body must contain valid JSON.'
            : error.type === 'entity.too.large'
              ? 'Request body exceeds the 16 KB limit.'
              : error.message;
  res.status(status).json({
    error: { code: status === 500 ? 'INTERNAL_SERVER_ERROR' : 'REQUEST_ERROR', message },
    requestId: req.id
  });
}
