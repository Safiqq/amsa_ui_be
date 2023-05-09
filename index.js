require("dotenv").config();
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(
  cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Use body parser
app.use(bodyParser.json());

// Set body limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Set up multer middleware to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define a schema for the data collection
const dataSchema = new mongoose.Schema({
  nama: String,
  noHp: String,
  email: String,
  instansi: String,
  pekerjaan: String,
  bundle: Number,
  kodeReferral: String,
  buktiTransfer: {
    data: Buffer,
    contentType: String
  },
  namaAkunTransfer: String
});

// Create a model for the data collection
const Data = mongoose.model('Regist', dataSchema);

// Define a route for handling form data and file uploads
app.post('/upload',
  upload.single('buktiTransfer'),
  [
    body('nama').notEmpty().withMessage('Nama tidak boleh kosong'),
    body('noHp').notEmpty().withMessage('Nomor HP tidak boleh kosong'),
    body('email').notEmpty().withMessage('Email tidak boleh kosong').isEmail().withMessage('Email tidak valid'),
    body('instansi').notEmpty().withMessage('Instansi tidak boleh kosong'),
    body('pekerjaan').notEmpty().withMessage('Pekerjaan tidak boleh kosong'),
    body('bundle').notEmpty().withMessage('Bundle tidak boleh kosong'),
    body('namaAkunTransfer').notEmpty().withMessage('Nama Akun Transfer tidak boleh kosong')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const data = new Data({
        nama: req.body.nama,
        noHp: req.body.noHp,
        email: req.body.email,
        instansi: req.body.instansi,
        pekerjaan: req.body.pekerjaan,
        bundle: req.body.bundle,
        kodeReferral: req.body.kodeReferral,
        buktiTransfer: {
          data: req.body.data,
          contentType: req.body.contentType
        },
        namaAkunTransfer: req.body.namaAkunTransfer
      });
      await data.save();
      return res.status(201).json({ message: 'Data and file uploaded successfully' });
    } catch (error) {
      console.error('Error uploading data and file:', error);
      return res.status(500).json({ message: 'Error uploading data and file' });
    }
  }
);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});