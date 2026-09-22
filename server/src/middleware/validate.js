import { ApiError } from './errorHandler.js';

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const details = result.error.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      }));
      throw new ApiError(400, 'Validation failed', details);
    }
    req[source] = result.data;
    next();
  };
}
