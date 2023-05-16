require("dotenv").config();
const express = require('express');
const fileUpload = require("express-fileupload");
const mongoose = require('mongoose');
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

// Set body limit
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Use body parser
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL, {
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
    file: String,
    filename: String,
    mimetype: String,
  },
  namaAkunTransfer: String,
});

// Create a model for the data collection
const Data = mongoose.model('Regist', dataSchema);

// Define a route for getting datas
app.get('/getData',
  async (req, res) => {
    try {
      const datas = await Data.find({});
      res.send(datas);
      console.log(datas);
    } catch (err) {
      console.log(err);
    }
  }
);

// Define a route for handling form data and file uploads
app.post('/upload',
  fileUpload({ createParentPath: true }),
  (req, res) => {
    Data.findOne({ email: req.body.email.trim() }).then(user => {
      if (user) {
        return res.status(500).json({ statusCode: 500, message: 'Email sudah terdaftar' });
      } else {
        const documentIds = [];
        const emails = [];
        try {
          const data = new Data({
            nama: req.body.nama.trim(),
            noHp: req.body.noHp.trim(),
            email: req.body.email.trim(),
            instansi: req.body.instansi.trim(),
            pekerjaan: req.body.pekerjaan.trim(),
            bundle: req.body.bundle,
            day: day,
            kodeReferral: req.body.kodeReferral.trim(),
            buktiTransfer: {
              file: req.body.buktiTransfer.file,
              filename: req.body.buktiTransfer.filename,
              mimetype: req.body.buktiTransfer.mimetype,
            },
            namaAkunTransfer: req.body.namaAkunTransfer.trim(),
          });
          documentIds.push(data.save()._id);
          emails.push(data.email);

          const bundleBuddies = req.body.bundleBuddies;
          for (let i = 0; i < bundleBuddies.length; i++) {
            let email = bundleBuddies[i].email.trim();
            if (emails.indexOf(email) === -1) {
              console.log(user);
              const dataBuddies = new Data({
                nama: bundleBuddies[i].nama.trim(),
                noHp: bundleBuddies[i].noHp.trim(),
                email: email,
                instansi: bundleBuddies[i].instansi.trim(),
                pekerjaan: req.body.pekerjaan.trim(),
                bundle: req.body.bundle,
                kodeReferral: req.body.kodeReferral.trim(),
                namaAkunTransfer: req.body.namaAkunTransfer.trim(),
              });
              documentIds.push(dataBuddies.save()._id);
              emails.push(dataBuddies.email);
            } else {
              return res.status(500).json({ statusCode: 500, message: 'Email sudah terdaftar' });
            }
          }
          return res.status(201).json({ statusCode: 201, message: 'Data and file uploaded successfully' });
        } catch (error) {
          for (let i = 0; i < documentIds.length; i++) {
            Data.deleteOne({ _id: ObjectId(documentIds[i]) });
          }
          console.error('Error uploading data and file:', error);
          // if (error.message === 'Email sudah terdaftar') {
          return res.status(500).json({ statusCode: 500, message: error.message });
          // } else {
          //   return res.status(500).json({ statusCode: 500, message: 'Error uploading data and file' });
          // }
        }
      }
    })
  }
);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});