class NoPermissionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NoPermissionError';
    this.statusCode = 403;
  }
}

module.exports = { NoPermissionError };
