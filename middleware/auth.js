const { asyncHandler } = require("../utils/utils.js")
const jwt = require("jsonwebtoken")
const ErrorResponse = require("../utils/errorResponse.js")
const User = require("../schema/user")

exports.protect = asyncHandler(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1]
  else if (req.cookies.token) {
    token = req.cookies.token
  }

  if (!token || token == "none")
    return next(new ErrorResponse("Unauthorized access!", 404))
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = await User.findOne({ _id: decoded.id })

    next()
  } catch (error) {
    if (!decoded) return next(new ErrorResponse("Unauthorize access"))
  }
})

exports.authorize = (...role) =>
  asyncHandler(async (req, res, next) => {
    if (!role.includes(req.user.role))
      return next(
        new ErrorResponse(
          `User role is not authorized to access this route.`,
          401
        )
      )

    next()
  })
