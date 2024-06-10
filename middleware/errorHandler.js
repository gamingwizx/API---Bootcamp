const ErrorResponse = require("../utils/errorResponse.js")

const ERROR_DUPLICATE_KEY = 11000
const ERROR_CAST = "CastError"
const ERROR_VALIDATION = "ValidationError"

const errorHandler = (err, req, res, next) => {
  let error = { ...err }

  error.message = err.message

  if (err.name === ERROR_VALIDATION) {
    const message = `ValidationError: ${error.message}`
    error = new ErrorResponse(`${message}`, 404)
  }

  if (err.name === ERROR_CAST) {
    const message = `CastError: Resources not found`
    error = new ErrorResponse(`${message}`, 404)
  }

  if (err.code === ERROR_DUPLICATE_KEY) {
    const message = "Duplicate Record: Record already exist"
    error = new ErrorResponse(`${message}`, 400)
  }

  if (err)
    res.status(error.status || 500).json({
      success: false,
      error: error.message
    })
}

module.exports = errorHandler
