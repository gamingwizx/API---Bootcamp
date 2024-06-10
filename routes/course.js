const express = require("express")
const {
  addCourse,
  getCourse,
  getAllCourse,
  updateCourse,
  deleteCourse,
  getBootcampCourse
} = require("../controllers/course.js")
const advancedResult = require("../middleware/advancedResult.js")
const courseSchema = require("../schema/course.js")
const router = express.Router({ mergeParams: true })

router
  .route("/")
  .get(advancedResult(courseSchema), getBootcampCourse)
  .post(addCourse)

router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse)

module.exports = router
