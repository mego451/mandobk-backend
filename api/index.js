const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Mandobk backend شغال 🚀");
});

module.exports = app;
