const express = require("express");
const app = express();
const Controllers = require("./Controllers");

// peserta
app.post("/upload", Controllers.buatPeserta);

module.exports = app;
