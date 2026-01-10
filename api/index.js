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
// إنشاء مشوار
app.get("/trips/create", (req, res) => {
  const { pickupCity, dropoffCity } = req.query;

  if (!pickupCity || !dropoffCity) {
    return res.json({
      error: "لازم تحدد pickupCity و dropoffCity"
    });
  }

  const price = pickupCity === dropoffCity ? 25 : 45;
  const commission = 5;

  res.json({
    message: "تم إنشاء المشوار",
    pickupCity,
    dropoffCity,
    price,
    commission,
    captainNet: price - commission
  });
});

export default app;
