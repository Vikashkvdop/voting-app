// middleware/errorMiddleware.js

const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  // Use error.statusCode if it's a number; otherwise, fallback to 500
  const statusCode = typeof error.statusCode === 'number' ? error.statusCode : 500;

  res.status(statusCode).json({
    message: error.message || 'An unknown error occurred.',
    stack: process.env.NODE_ENV === 'production' ? null : error.stack,
  });
};

export { notFound, errorHandler };
