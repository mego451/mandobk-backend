const express = require("express");
const app = express();

app.use(express.json()); // عشان نستقبل JSON

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.send("Mandobk backend شغال 🚀");
});
// تجربة GET عشان المتصفح
app.get("/trips", (req, res) => {
  const { pickupCity, dropoffCity } = req.query;

  if (!pickupCity || !dropoffCity) {
    return res.json({
      message: "حط pickupCity و dropoffCity في اللينك"
    });
  }

  let price = 25;
  if (pickupCity !== dropoffCity) {
    price = 45;
  }

  const commission = 5;
  const captainNet = price - commission;

  res.json({
    pickupCity,
    dropoffCity,
    price,
    commission,
    captainNet,
    message: "مشوار Mandobk اتعمل بنجاح"
  });
});


app.post("/trips", (req, res) => {
  const pickupCity = req.body.pickupCity || req.query.pickupCity;
  const dropoffCity = req.body.dropoffCity || req.query.dropoffCity;

  if (!pickupCity || !dropoffCity) {
    return res.status(400).json({
      error: "لازم تحدد مدينة الاستلام ومدينة التسليم"
    });
  }

  let price = 25;
  if (pickupCity !== dropoffCity) {
    price = 45;
  }

  const commission = 5;
  const captainNet = price - commission;

  res.json({
    pickupCity,
    dropoffCity,
    price,
    commission,
    captainNet,
    message: "تم إنشاء المشوار بنجاح"
  });
});


module.exports = app;
