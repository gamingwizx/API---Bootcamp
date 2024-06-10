const bootcamp = require("../schema/bootcamp.js")
const fileupload = require("express-fileupload")
const path = require("path")
const ErrorResponse = require("../utils/errorResponse.js")
const { asyncHandler } = require("../utils/utils.js")

//@desc  :  Add new bootcamp
//@Route :  POST /:bootcamp/id
//@Access:  Public
exports.addBootcamp = asyncHandler(async (req, res, next) => {
  const existingBootcamp = await bootcamp.findOne({ user: req.user._id })
  if (existingBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse("Can only create one bootcamp per user.", 404)
    )
  }

  req.body.user = req.user

  const newBootcamp = await bootcamp.create(req.body)
  await newBootcamp.save()
  res
    .status(200)
    .json({ success: true, msg: `Added bootcamp ${newBootcamp.id}` })
})

//@desc  :  Get single bootcamp
//@Route :  GET /:bootcamp/id
//@Access:  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const retrievedBootcamp = await bootcamp
    .findById(req.params.id)
    .populate("courses")

  if (!retrievedBootcamp) {
    return next(
      new ErrorResponse(
        `Could not find bootcamp with an id ${req.params.id}`,
        404
      )
    )
  }

  res.status(200).json({ success: true, data: retrievedBootcamp })
})

//@desc  :  Get all bootcamp
//@Route :  POST /:bootcamp
//@Access:  Public
exports.getAllBootcamp = async (req, res, next) => {
  res.status(200).json(res.advancedResult)
}

//@desc  :  Update bootcamp
//@Route :  PUT /:bootcamp/id
//@Access:  Public
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bc = await bootcamp.findOne({ user: req.user._id })
  if (bc === null && req.user.role != "admin") {
    return next(
      new ErrorResponse(
        "Only the creator of the bootcamp can modify this bootcamp",
        404
      )
    )
  }
  const updatedBootcamp = await bootcamp.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  )

  console.log(updatedBootcamp)

  if (!updatedBootcamp) {
    return next(
      new ErrorResponse(`Could not find bootcamp with id ${req.params.id}`)
    )
  }

  res.status(200).json({ success: true, data: updatedBootcamp })
})

//@desc  :  Delete bootcamp
//@Route :  DELETE /:bootcamp/id
//@Access:  Public
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bc = await bootcamp.findOne({ user: req.user._id })
  if (bc === null && req.user.role != "admin") {
    return next(
      new ErrorResponse(
        "Only the creator of the bootcamp can modify this bootcamp",
        404
      )
    )
  }

  const deletedBootcamp = await bootcamp.findById(req.params.id)

  if (!deletedBootcamp) {
    return next(
      new ErrorResponse(`Unable to find bootcamp with id ${req.params.id}`)
    )
  }

  await bootcamp.deleteOne({ _id: req.params.id })

  res.status(200).json({
    success: true,
    msg: `Successfully deleted bootcamp ${req.params.id}`
  })
})

//@desc  :  Upload picture
//@Route :  POST /:bootcamp/id/upload
//@Access:  Public
exports.uploadPicture = asyncHandler(async (req, res, next) => {
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 404))
  }
  const file = req.files.file
  if (!file.mimetype.startsWith("image")) {
    return next(
      new ErrorResponse(`Invalid file type, please enter an image file!`, 404)
    )
  }

  const fileName = `photo_${req.params.bootcampId}${path.parse(file.name).ext}`
  const filePath = `${process.env.UPLOAD_PATH}/${fileName}`
  file.mv(filePath, async (err) => {
    if (err) {
      return next(
        new ErrorResponse(
          `There is something wrong when uploading file: ${err}`,
          404
        )
      )
    }
  })

  await bootcamp.findByIdAndUpdate(req.params.bootcampId, {
    filename: fileName
  })

  res.status(200).json({
    success: true,
    data: fileName
  })
})
