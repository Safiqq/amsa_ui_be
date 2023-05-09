const express = require("express");
const app = express();
const Controllers = require("./Controllers");

// peserta
app.post(
  "/register",
  Controllers.validasiPeserta[0],
  //   Controllers.validasiPeserta[1],
  Controllers.buatPeserta
);

module.exports = app;
