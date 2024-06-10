const mongoose = require("mongoose")
const course = require("./course.js")
const slugify = require("slugify")

const bootcamp = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Cannot be longer than 50 characters"]
    },
    description: {
      type: String,
      required: [true, "Please enter a description"],
      maxlength: [500, "Cannot be longer than 500 characters"]
    },
    website: {
      type: String,
      match: [
        /^(https?:\/\/)?((([a-zA-Z0-9\-_]+\.)+[a-zA-Z]{2,})|localhost)(:\d{2,5})?(\/[^\s]*)?$/,
        "Please use HTTP or HTTPS"
      ]
    },
    phone: {
      type: String,
      match: [/\(\d{3}\) \d{3}-\d{4}/, "Please enter a valid phone number"]
    },
    email: {
      type: String,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email"
      ]
    },
    address: {
      type: String,
      required: [true, "Please enter an address"]
    },
    location: {
      type: {
        type: String,
        enum: ["Point"]
      },
      coordinates: {
        type: [Number],
        index: "2dsphere"
      },
      formattedAddress: String,
      street: String,
      state: String,
      city: String,
      zipcode: String,
      country: String
    },
    careers: {
      type: [String],
      enum: [
        "Web Development",
        "Data Science",
        "Business",
        "UI/UX",
        "Mobile Development"
      ]
    },
    housing: {
      type: Boolean,
      default: false
    },
    jobAssistance: {
      type: Boolean,
      default: false
    },
    jobGuarantee: {
      type: Boolean,
      default: false
    },
    acceptGi: {
      type: Boolean,
      defailt: false
    },
    slug: String,
    averageCost: Number,
    filename: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true
    },
    rating: Number
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

bootcamp.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

bootcamp.pre("deleteOne", async function (next) {
  const bootcampId = this.getFilter()["_id"]
  await course.deleteMany({ bootcamp: bootcampId })
  next()
})

bootcamp.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false
})

module.exports = mongoose.model("Bootcamp", bootcamp)
