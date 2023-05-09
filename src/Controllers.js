const models = require("./Models");
const { body, validationResult } = require("express-validator");

exports.validasiPeserta = [
  body("email").isEmail(),
  body("email").custom((value) => {
    return models.peserta.findOne({ email: value }).then((peserta) => {
      if (peserta) {
        return Promise.reject("Email sudah terdaftar");
      }
    });
  }),
];

// create peserta
exports.buatPeserta = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Input tidak sesuai");
      err.errorStatus = 400;
      err.data = errors.array();
      throw err;
    }

    // if (!req.files) {
    //   const err = new Error("Upload image!");
    //   err.errorStatus = 422;
    //   throw err;
    // }

    const peserta = new models.peserta({
      email: req.body.email,
      nama: req.body.nama,
      ttl: req.body.ttl,
      gender: req.body.gender,
      sekolah: req.body.sekolah,
      lomba: req.body.lomba,
      idline: req.body.idline,
      notelp: req.body.notelp,
      kartu: req.body.kartu,
      surat: req.body.surat,
      foto: req.body.foto,
      bukti: req.body.bukti,
      // bukti_pembayaran: req.files.bukti_pembayaran[0].path,
      is_verified: false,
    });
    const savePeserta = await peserta.save();
    res.status(201).send(savePeserta);
  } catch {
    res.sendStatus(400);
  }
};
