
class BadRequestError extends Error {
  constructor(message) {
    super(message)
    this.statusCode = 400;
  }
}

class ServerError extends Error {
  constructor(message) {
    super(message)
    this.statusCode = 500;
  }
}

module.exports = {
  BadRequestError,
  ServerError
}