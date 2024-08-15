const mongoose = require("mongoose");
const env = require("dotenv");

env.config({ path: "./config/.env" });

async function connectDB() {
  await mongoose.connect(process.env.MONGO_URL);
}

module.exports = connectDB;
