const express = require("express")
const {
  addBootcamp,
  getBootcamp,
  getAllBootcamp,
  updateBootcamp,
  deleteBootcamp,
  uploadPicture
} = require("../controllers/bootcamp.js")
const courseRoute = require("./course.js")
const reviewRoute = require("./review.js")
const BootcampSchema = require("../schema/bootcamp.js")
const advancedResult = require("../middleware/advancedResult.js")
const { protect, authorize } = require("../middleware/auth.js")
const router = express.Router()

router.use("/:bootcampId/reviews", reviewRoute)
router.use("/:bootcampId/courses", courseRoute)

router
  .route("/:bootcampId/photo")
  .put(protect, authorize("publisher", "admin"), uploadPicture)
router
  .route("/")
  .get(advancedResult(BootcampSchema), getAllBootcamp)
  .post(protect, authorize("publisher", "admin"), addBootcamp)

router
  .route("/:id")
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp)
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)

module.exports = router
