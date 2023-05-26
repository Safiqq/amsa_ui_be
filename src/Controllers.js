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
    await data.save();

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
      await dataBuddies.save();
    }
    res.status(201).send({
      statusCode: 201,
      message: "Data and file uploaded successfully",
    });
  } catch (error) {
    models.peserta.deleteOne({ email: req.body.email.trim() });
    for (let i = 0; i < bundleBuddies.length; i++) {
      models.peserta.deleteOne({ email: bundleBuddies[i].email.trim() });
    }
    console.error("Error uploading data and file:", error);

    res.sendStatus(400);
    // }
  }
};

exports.getData = async (req, res) => {
  try {
    const datas = await models.peserta.find({});
    res.send(datas);
    console.log(datas);
  } catch (err) {
    res.sendStatus(400);
    console.log(err);
  }
};

// exports.getImage = async (req, res) => {
//   try {
//     let id = new mongoose.mongo.ObjectId(req.query.id);
//     const datas = await models.peserta.find({ _id: id });
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
// };
