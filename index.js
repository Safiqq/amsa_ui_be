require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, OPTIONS, PATCH, DELETE, POST, PUT"
  );
  // res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
  res.setHeader("Access-Control-Allow-Headers", "*");
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
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

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

// Define a route for getting datas
app.get("/getData", async (req, res) => {
  try {
    const datas = await Data.find({});
    res.send(datas);
    console.log(datas);
  } catch (err) {
    console.log(err);
  }
});

// Define a route for getting images
// app.get("/getImage", async (req, res) => {
//   try {
//     let id = new mongoose.mongo.ObjectId(req.query.id);
//     const datas = await Data.find({ _id: id });
//     if (datas.length > 0) {
//       const data = datas[0];
//       const imageBuffer = Buffer.from(
//         data.buktiTransfer.file.split(",")[1],
//         "base64"
//       );
//       res.setHeader("Content-Type", data.buktiTransfer.mimetype);
//       res.setHeader("Content-Length", imageBuffer.length);
//       res.end(imageBuffer);
//     } else {
//       res.send("Image not found.");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

const routes = require("./src/Routes");
app.use(routes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
