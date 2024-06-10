const mongoose = require("mongoose")
const bootcamp = require("./bootcamp.js")

const course = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter course title"],
    unique: true,
    trim: true,
    maxlength: [50, "Course title must be less than 50 characters"]
  },
  description: {
    type: String,
    required: [true, "Please enter course description"],
    maxlength: [500, "Course description must be less than 500 characters"]
  },
  weeks: {
    type: Number,
    required: [true, "Please enter number of weeks needed to complete"]
  },
  tuition: {
    type: Number,
    required: [true, "Please enter the tuition fees"]
  },
  minimumSkill: String,
  scholarshipAvailable: Boolean,
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true
  }
})

course.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: bootcampId,
        averageCost: { $avg: "$tuition" }
      }
    }
  ])

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.floor(obj[0].averageCost * 10) / 10
    })
  } catch (error) {
    console.error(error)
  }
}

course.post("save", async function (next) {
  this.constructor.getAverageCost(this.bootcamp)
})

module.exports = mongoose.model("Course", course)
