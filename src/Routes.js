const express = require("express");
const app = express();
const Controllers = require("./Controllers");

// peserta
app.post("/register", Controllers.buatPeserta);
app.get("/getData", Controllers.getData);

module.exports = app;
