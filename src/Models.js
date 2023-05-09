const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pesertaSchema = new Schema({
  nama: String,
  noHp: String,
  email: String,
  instansi: String,
  pekerjaan: String,
  bundle: Number,
  kodeReferral: String,
  buktiTransferBuffer: String,
  buktiTransferFilename: String,
  namaAkunTransfer: String,
});
const peserta = mongoose.model("regist", pesertaSchema);

module.exports = {
  peserta,
};
