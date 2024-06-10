const { asyncHandler } = require("../utils/utils.js")
const ErrorResponse = require("../utils/errorResponse.js")
const { sendEmail } = require("../utils/sendEmail.js")
const crypto = require("crypto")
const User = require("../schema/user.js")

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body

  const findUser = await User.findOne({ email })
  if (findUser)
    return next(new ErrorResponse(`This user has been registered`, 404))

  const user = await User.create({
    name,
    email,
    password,
    role
  })

  getJWToken(user, res)
})

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password)
    return next(new ErrorResponse("Email or password is invalaid!", 404))

  const user = await User.findOne({ email }).select("+password")

  if (!user) return next(new ErrorResponse("User does not exist!", 404))

  const isMatch = await user.matchPassword(password)

  if (!isMatch) return next(new ErrorResponse("Wrong credentials!", 404))

  getJWToken(user, res)
})

exports.update = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body
  const user = await User.findOne({ email }).select("+password")

  if (!user) return next(new ErrorResponse("User does not exist!", 404))

  const updateUser = await User.findByIdAndUpdate(
    { _id: req.user.id },
    {
      email,
      password,
      role
    }
  )
  res.status(200).json({
    success: true,
    user: updateUser
  })
})

exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 60 * 1000),
    httpOnly: true
  })

  res.status(200).json({ success: true, msg: "Successfully logged out" })
})

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id })
  if (!user) {
    return next(
      new ErrorResponse(`Could not find user with email ${req.user.email}`, 404)
    )
  }

  const resetToken = user.generateResetToken()

  await user.save({ validateBeforeSave: false })
  try {
    const url = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/resetpassword/${resetToken}`

    const options = {
      to: req.user.email,
      subject: "Reset Password",
      text: `Please reset password with this link:\n${url}`
    }

    await sendEmail(options)

    res.status(200).json({ success: true, user })
  } catch (err) {
    next(new ErrorResponse(`${err}`, 404))
  }
})

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex")

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() }
  })
  if (!user) {
    return next(new ErrorResponse(`Invalid token`, 404))
  }

  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()

  res.status(200).json({ success: true, msg: "Successfully changed password" })
})

exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  }
  const user = await User.findByIdAndUpdate(
    { _id: req.user._id },
    fieldsToUpdate,
    {
      new: true,
      runValidators: true
    }
  )
  if (!user) {
    return next(new ErrorResponse(`User with email ${email} is not found`, 404))
  }

  res.status(200).json({ success: true, user })
})

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id }).select("+password")
  if (!user)
    return next(
      new ErrorResponse(`Cannot find user with id ${req.user._id}`, 404)
    )

  const isMatch = await user.matchPassword(req.body.currentPassword)
  if (!isMatch) return next(new ErrorResponse(`Entered wrong password`, 404))

  user.password = req.body.newPassword

  await user.save()

  res.status(200).json({ success: true, msg: "Successfully updated password" })
})

exports.me = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id })

  res.status(200).json({ success: true, user: user })
})

function getJWToken(user, res) {
  const token = user.createJWToken()

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRE_IN_NUMBER * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  }

  res
    .status(200)
    .cookie("token", token, options)
    .json({ success: true, token: token })
}
