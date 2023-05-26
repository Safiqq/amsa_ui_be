const models = require("./Models");

exports.buatPeserta = async (req, res) => {
  try {
    const data = new models.peserta({
      nama: req.body.nama.trim(),
      noHp: req.body.noHp.trim(),
      email: req.body.email.trim(),
      instansi: req.body.instansi.trim(),
      pekerjaan: req.body.pekerjaan.trim(),
      bundle: req.body.bundle,
      day: req.body.day,
      kodeReferral: req.body.kodeReferral.trim(),
      buktiTransfer: req.body.buktiTransfer.trim(),
      // buktiTransfer: {
      //   file: req.body.buktiTransfer.file,
      //   filename: req.body.buktiTransfer.filename,
      //   mimetype: req.body.buktiTransfer.mimetype,
      // },
      namaAkunTransfer: req.body.namaAkunTransfer.trim(),
    });
    data.save();

    const bundleBuddies = req.body.bundleBuddies;
    for (let i = 0; i < bundleBuddies.length; i++) {
      let email = bundleBuddies[i].email.trim();
      // console.log(user);
      const dataBuddies = new models.peserta({
        nama: bundleBuddies[i].nama.trim(),
        noHp: bundleBuddies[i].noHp.trim(),
        email: email,
        instansi: bundleBuddies[i].instansi.trim(),
        pekerjaan: req.body.pekerjaan.trim(),
        bundle: req.body.bundle,
        day: req.body.day,
        kodeReferral: req.body.kodeReferral.trim(),
        namaAkunTransfer: req.body.namaAkunTransfer.trim(),
      });
      dataBuddies.save();
    }
    return res.status(201).json({
      statusCode: 201,
      message: "Data and file uploaded successfully",
    });
  } catch (error) {
    for (let i = 0; i < emails.length; i++) {
      models.peserta.deleteOne({ email: emails[i] });
    }
    console.error("Error uploading data and file:", error);
    // if (error.message === 'Email sudah terdaftar') {
    // return res.status(500).json({ statusCode: 500, message: error.message });
    // } else {
    return res
      .status(500)
      .json({ statusCode: 500, message: "Error uploading data and file" });
    // }
  }
};

exports.getData = async (req, res) => {
  try {
    const datas = await models.peserta.find({});
    res.send(datas);
    console.log(datas);
  } catch (err) {
    console.log(err);
  }
};