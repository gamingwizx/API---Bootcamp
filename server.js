const express = require("express");
const env = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const colors = require("colors");
const fileupload = require("express-fileupload");
const bodyParser = require("body-parser");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

const connectDB = require("./db.js");

//Routes
const bootcamp = require("./routes/bootcamp");
const course = require("./routes/course");
const auth = require("./routes/auth");
const admin = require("./routes/admin");
const review = require("./routes/review");

var cookieParser = require("cookie-parser");

env.config({ path: "./config/.env" });

connectDB();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(fileupload());
app.use(cors());
app.use(hpp());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);
app.use(xss());
app.use(mongoSanitize());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/bootcamps", bootcamp);
app.use("/api/v1/courses", course);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", admin);
app.use("/api/v1/reviews", review);

app.use(errorHandler);

if (process.env.NODE_ENV === "DEVELOPMENT") {
  app.use(morgan("dev"));
}

const server = app.listen(
  process.env.PORT,
  console.log(
    `Server is listening on port ${process.env.PORT}`.yellow.underline.bold
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error:   ${err.message}`.underline.red);
  server.close(() => process.exit(1));
});
