import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Mandobk backend شغال 🚀" });
});

// مهم جدًا
export default app;
