import express from "express";

const app = express();
app.use(express.json());

// route أساسي
app.get("/", (req, res) => {
  res.json({ message: "Mandobk backend شغال 🚀" });
});

// route أمان
app.get("/api", (req, res) => {
  res.json({ message: "Mandobk backend شغال 🚀 (api)" });
});

export default app;
