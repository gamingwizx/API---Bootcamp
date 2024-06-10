const { asyncHandler } = require("../utils/utils.js")
const ErrorResponse = require("../utils/errorResponse.js")
const Review = require("../schema/review.js")

exports.getBootcampReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId })
    res.status(200).json({ success: true, reviews })
  } else {
    res.status(200).json(res.advancedResult)
  }
})
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findOne({ _id: req.params.id })
  if (!review) {
    return next(
      new ErrorResponse(`Review with id ${req.params.id} cannot be found`, 404)
    )
  }

  res.status(200).json({ success: true, review })
})
exports.addReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findOne({ user: req.user._id })

  if (review) {
    return next(new ErrorResponse(`Each user can only add one review`, 404))
  }

  req.body.bootcamp = req.params.bootcampId
  req.body.user = req.user._id
  req.body.createdDate = Date.now()

  const createdReview = await Review.create(req.body)
  await createdReview.save()

  if (!createdReview) {
    return next(new ErrorResponse(`Review failed to create!`, 404))
  }

  res.status(200).json({ success: true, createdReview })
})
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findOne({ _id: req.params.id })
  if (!review) {
    return next(new ErrorResponse(`Could not find review`, 404))
  }

  if (review.user.toString() != req.user.id && req.user.role != "admin") {
    return next(new ErrorResponse(`Only the owner of the review can edit`, 404))
  }

  const deletedReview = await Review.findByIdAndDelete({ _id: req.params.id })

  if (!createdReview) {
    return next(new ErrorResponse(`Review failed to delete!`, 404))
  }

  res.status(200).json({
    success: true,
    msg: `Successfully deleted review ${req.params.id}`
  })
})

exports.updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findOne({ _id: req.params.id })

  if (review.user.toString() != req.user.id && req.user.role != "admin") {
    return next(new ErrorResponse(`Only the owner of the review can edit`, 404))
  }

  const updatedReview = await Review.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    { runValidators: true, new: true }
  )

  if (!updatedReview) {
    return next(new ErrorResponse(`Review failed to update!`, 404))
  }

  res.status(200).json({ success: true, updatedReview })
})
