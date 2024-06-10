const mongoose = require("mongoose")
const Bootcamp = require("./bootcamp.js")

const review = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter title!"],
    maxlength: [50, "Please keep title under 50 characters!"]
  },
  text: {
    type: String,
    required: [true, "Please enter description of review!"]
  },
  rating: {
    type: Number,
    required: [true, "Please enter rating"]
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  createdDate: {
    type: Date,
    required: [true, "Please enter created date"]
  }
})

review.statics.averageRating = async function (bootcampId) {
  try {
    const obj = await this.aggregate([
      {
        $match: { bootcamp: bootcampId }
      },
      {
        $group: {
          _id: "$bootcamp",
          averageRating: { $avg: "$rating" }
        }
      }
    ])
    const updatedBootcamp = await Bootcamp.findByIdAndUpdate(
      { _id: bootcampId },
      {
        rating: obj[0].averageRating
      }
    )
  } catch (err) {
    console.error(err)
  }
}

review.post("save", function (next) {
  this.constructor.averageRating(this.bootcamp)
})

module.exports = mongoose.model("Review", review)
