require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-type, Authorization");
  next();
});

app.use(
  cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Set body limit
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.set("strictQuery", false);
connection();
async function connection() {
  try {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(process.env.MONGODB_URL, connectionParams);
    console.log("connected to database");
  } catch (error) {
    console.log(error);
    console.log("could not connect to database");
  }
}

const routes = require("./src/Routes");
app.use("/api", routes);

// Start the server
const port = 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
