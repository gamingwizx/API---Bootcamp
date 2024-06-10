const { asyncHandler } = require("../utils/utils.js")
const User = require("../schema/user.js")
const ErrorResponse = require("../utils/errorResponse.js")

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find()

  res.status(200).json({ success: true, users })
})
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id })

  if (!user) {
    return next(
      new ErrorResponse(`Could not find user with id ${req.params.id}`, 404)
    )
  }

  res.status(200).json({ success: true, user })
})
exports.updateUser = asyncHandler(async (req, res, next) => {
  const newUserInfo = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  }
  const user = await User.findByIdAndUpdate(
    { _id: req.params.id },
    newUserInfo,
    {
      runValidators: true,
      new: true
    }
  )

  if (!user) {
    return next(
      new ErrorResponse(`Could not find user with id ${req.params.id}`, 404)
    )
  }

  res.status(200).json({ success: true, user })
})
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete({ _id: req.params.id })

  if (!user) {
    return next(
      new ErrorResponse(`Could not find user with id ${req.params.id}`, 404)
    )
  }

  res.status(200).json({ success: true, msg: "Successfully deleted user" })
})
