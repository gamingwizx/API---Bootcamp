const Course = require("../schema/course.js")
const Bootcamp = require("../schema/bootcamp.js")
const ErrorResponse = require("../utils/errorResponse.js")
const { asyncHandler } = require("../utils/utils.js")

//@desc  :  Add new Course
//@Route :  POST /:Course/id
//@Access:  Public
exports.addCourse = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.find({ _id: req.params.bootcampId })
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Could not find bootcamp with id ${req.params.bootcampId}`,
        404
      )
    )
  }

  const newCourse = await Course.create(req.body)
  await newCourse.save()
  res.status(200).json({ success: true, msg: `Added Course ${newCourse.id}` })
})

//@desc  :  Get single Course
//@Route :  GET /:Course/id
//@Access:  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const retrievedCourse = await Course.findById(req.params.id)

  if (!retrievedCourse) {
    return next(
      new ErrorResponse(
        `Could not find Course with an id ${req.params.id}`,
        404
      )
    )
  }

  res.status(200).json({ success: true, data: retrievedCourse })
})

//@desc  :  Get all Course, and from bootcamp ones
//@Route :  GET /bootcamps/:bootcampId/courses
//@Access:  Public
exports.getAllCourse = async (req, res, next) => {
  res.status(200).json(res.advancedResult)
}

//@desc  :  Update Course
//@Route :  PUT /:Course/id
//@Access:  Public
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  )

  if (!updatedCourse) {
    return next(
      new ErrorResponse(`Could not find Course with id ${req.params.id}`)
    )
  }

  res.status(200).json({ success: true, data: updatedCourse })
})

//@desc  :  Delete Course
//@Route :  DELETE /:Course/id
//@Access:  Public
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const deletedCourse = await Course.findByIdAndDelete(req.params.id)

  if (!deletedCourse) {
    return next(
      new ErrorResponse(`Unable to find Course with id ${req.params.id}`)
    )
  }

  res.status(200).json({
    success: true,
    msg: `Successfully deleted Course ${req.params.id}`
  })
})

//@desc  :  Get Bootcamp Courses
//@Route :  GET /bootcamps/:bootcampId/courses
//@Access:  Public
exports.getBootcampCourse = asyncHandler(async (req, res, next) => {
  console.log(req.params.bootcampId)
  let courses
  if (req.params.bootcampId) {
    courses = await Course.find({ bootcamp: req.params.bootcampId }).populate({
      path: "bootcamp",
      select: "name description"
    })

    res.status(200).json({
      success: true,
      data: courses
    })
  } else {
    res.status(200).json(res.advancedResult)
  }
})
