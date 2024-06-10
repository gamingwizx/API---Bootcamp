//seed database with json files and command line
//1) import the dotenv file
//2) connect to mongodb database
//3) import the data (json file) from data folder
//4) create function to create new data, try catch it
//5) create function to delete data
//6) add if (process.env[2] === '-i) to install data
//7) add process.env[2] === JSON.parse()
const colors = require("colors")
const fs = require("fs")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const bootcampSchema = require("./schema/bootcamp.js")
const courseSchema = require("./schema/course.js")
const reviewSchema = require("./schema/review.js")
const userSchema = require("./schema/user.js")
dotenv.config({ path: "./config/.env" })

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/data/bootcamps.json`, "utf-8")
)
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/data/courses.json`, "utf-8")
)
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/data/reviews.json`, "utf-8")
)
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/data/users.json`, "utf-8")
)

mongoose.connect(process.env.MONGO_URI)

const createData = async () => {
  try {
    await bootcampSchema.create(bootcamps)
    await courseSchema.create(courses)
    await reviewSchema.create(reviews)
    await userSchema.create(users)

    console.log("Successfully seeded data".green.inverse)
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

const deleteData = async () => {
  try {
    await bootcampSchema.deleteMany()
    await courseSchema.deleteMany()
    await reviewSchema.deleteMany()
    await userSchema.deleteMany()

    console.log("Successfully deleted data".red.inverse)
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

if (process.argv[2] === "-i") {
  createData()
} else if (process.argv[2] === "-d") {
  deleteData()
}
