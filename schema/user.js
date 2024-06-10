const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const user = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter name"]
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email"
    ],
    unique: true
  },
  role: {
    type: String,
    required: [true, "Please enter role"],
    enum: ["publisher", "user", "admin"],
    default: "user"
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    minlength: 6,
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
})

user.methods.createJWToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_IN_TIMELINE
  })

  return token
}

user.methods.generateResetToken = function (next) {
  const token = crypto.randomBytes(20).toString("hex")

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

  return token
}
user.methods.matchPassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password)
  return isMatch
}

user.pre("save", async function (next) {
  if (this.password === undefined) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

module.exports = mongoose.model("User", user)
