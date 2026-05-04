export const jsonErrorHandler = function (error, req, res, next) {
  if (!res.headersSent) {
    if (process.env.NODE_ENV === 'development') {
      res.status(500).json({ message: error.stack });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  next(error);
};
