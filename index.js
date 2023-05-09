require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-type, Authorization");
  next();
});

// cors
var cors = require("cors");
app.use(
  cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.set("strictQuery", false);
connection();
async function connection() {
  try {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(process.env.DB, connectionParams);
    console.log("connected to database");
  } catch (error) {
    console.log(error);
    console.log("could not connect to database");
  }
}

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  multer({ storage: storage, fileFilter: fileFilter }).fields([
    {
      name: "kartu_identitas",
      maxCount: 1,
    },
    {
      name: "surat_keterangan",
      maxCount: 1,
    },
    {
      name: "bukti_pembayaran",
      maxCount: 1,
    },
  ])
);

const routes = require("./src/Routes");
app.use("/api", routes);

const port = 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
