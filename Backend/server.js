const express = require("express");
const mongoose = require("mongoose");
const userSeeder = require("./seeder/users");
const reviewSeeder = require("./seeder/reviews");
const offerSeeder = require("./seeder/offers");
const transactionSeeder = require("./seeder/transactions");
const passport = require("passport");
const ejs = require("ejs");

require("dotenv").config();

const app = express();

// Middleware.
app.use(express.json({ limit: "10mb" })); // To support images of larger size.
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

require("./src/passport")(passport);
app.use(passport.initialize());

// DB config.
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected!");
    if (process.env.ENV === "DEV") {
      console.log("Seeding initial data in DB if needed...");
      await userSeeder.seed();
      await reviewSeeder.seed();
      await offerSeeder.seed();
      await transactionSeeder.seed();
    }
  })
  .catch((err) => {
    console.log(err);
  });

// Set view engine
app.set("view engine", "ejs");
app.get("/", (req, res) => res.render("index"));

//Define Routes
app.get("/api/health", (req, res) => res.send("API service healthy"));
app.use("/api/offers", require("./src/routes/offers"));
app.use("/api/reviews", require("./src/routes/reviews"));
app.use("/api/transactions", require("./src/routes/transactions"));
app.use("/api/users", require("./src/routes/users"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port: ${port}`));
