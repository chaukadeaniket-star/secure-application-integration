export function validateRequest(validator) {
  return (req, res, next) => {
    const result = validator(req.body);
    if (!result.valid) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Please correct the invalid fields.',
          details: result.errors
        },
        requestId: req.id
      });
    }
    req.validatedBody = result.value;
    return next();
  };
}
