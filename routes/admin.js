const express = require("express")
const advancedResult = require("../middleware/advancedResult.js")
const { protect, authorize } = require("../middleware/auth.js")
const {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser
} = require("../controllers/admin.js")
const User = require("../schema/user.js")

const router = express.Router()

router.use(protect)
router.use(authorize("admin"))

router.route("/").get(advancedResult(User), getAllUsers)
router.route("/:id").get(getUser).delete(deleteUser).put(updateUser)

module.exports = router
