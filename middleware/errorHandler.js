const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Handle CORS errors specifically
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS policy violation' });
  }
  
  // Default error response
  const status = err.statusCode || 500;
  res.status(status).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
};

module.exports = errorHandler;