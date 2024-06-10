const express = require("express")
const {
  getBootcampReviews,
  getReview,
  addReview,
  deleteReview,
  updateReview
} = require("../controllers/review.js")
const advancedResult = require("../middleware/advancedResult.js")
const reviewSchema = require("../schema/review.js")
const { protect, authorize } = require("../middleware/auth")
const router = express.Router({ mergeParams: true })

router
  .route("/")
  .get(
    protect,
    authorize("admin"),
    advancedResult(reviewSchema),
    getBootcampReviews
  )
  .post(protect, addReview)
router
  .route("/:id")
  .get(getReview)
  .put(protect, updateReview)
  .delete(protect, deleteReview)
module.exports = router
