// Wraps a Zod schema and validates req.body against it,
// attaching a clean 400 error with field-level details on failure.
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const err = new Error('Validation failed');
      err.status = 400;
      err.expose = true;
      err.details = result.error.flatten().fieldErrors;
      return next(err);
    }
    req.validatedBody = result.data;
    return next();
  };
}

module.exports = { validate };
