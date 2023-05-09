require("dotenv").config();
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const cors = require('cors');

const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
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

// Set up multer middleware to handle file uploads
const storage = multer.memoryStorage();
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
          data: req.file.buffer,
          contentType: req.file.mimetype
        },
        namaAkunTransfer: req.body.namaAkunTransfer
      });
      await data.save();
      return res.status(201).send('Data and file uploaded successfully');
    } catch (error) {
      console.error('Error uploading data and file:', error);
      return res.status(500).send('Error uploading data and file');
    }
  }
);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});