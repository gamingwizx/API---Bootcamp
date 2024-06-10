const express = require("express")
const {
  register,
  login,
  me,
  update,
  forgetPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  logout
} = require("../controllers/auth.js")
const advancedResult = require("../middleware/advancedResult.js")
const { protect } = require("../middleware/auth.js")
const router = express.Router()

router.route("/").post(register).put(protect, update)
router.route("/login").post(login)
router.route("/me").get(protect, me)
router.route("/forgetpassword").post(protect, forgetPassword)
router.route("/resetPassword/:resetToken").post(protect, resetPassword)
router.route("/updatedetails").put(protect, updateDetails)
router.route("/updatePassword").put(protect, updatePassword)
router.route("/logout").post(protect, logout)

module.exports = router
