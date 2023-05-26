const express = require("express");
const app = express();
const Controllers = require("./Controllers");

// peserta
app.post("/register", Controllers.buatPeserta);
app.get("/getData", Controllers.getData);
app.get("/getImage", Controllers.getImage);

module.exports = app;
