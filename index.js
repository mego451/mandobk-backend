const express = require("express");
const app = express();

// أول Route
app.get("/", (req, res) => {
  res.send("Mandobk backend شغال 🚀");
});

// Render بيحدد PORT لوحده
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
