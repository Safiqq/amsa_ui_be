const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define a schema for the data collection
const dataSchema = new Schema({
  nama: String,
  noHp: String,
  email: String,
  instansi: String,
  pekerjaan: String,
  bundle: Number,
  day: Number,
  kodeReferral: String,
  buktiTransfer: String,
  // buktiTransfer: {
  //   file: String,
  //   filename: String,
  //   mimetype: String,
  // },
  namaAkunTransfer: String,
});

// Create a model for the data collection
const peserta = mongoose.model("peserta", dataSchema);

module.exports = {
  peserta,
};
