const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ===== MongoDB Connection Test =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });


// ================== CONSTANTS ==================
const PRICE_SAME_CITY = 25;
const PRICE_CROSS_CITY = 45;
const COMMISSION = 5;
const MAX_ACTIVE_TRIPS = 5;

// ================== DATA (IN MEMORY) ==================
let trips = [];
let captains = [
  { id: 1, name: "Captain Magdy", phone: "01289982511", activeTrips: 0, good: 0, bad: 0 },
  { id: 2, name: "Captain Ahmed", phone: "01000000002", activeTrips: 0, good: 0, bad: 0 }
];

let tripIdCounter = 1;
let captainIdCounter = 3;

// ================== ROOT ==================
app.get("/", (req, res) => {
  res.send("Mandobk backend شغال 🚀");
});

// ================== CAPTAINS ==================

// تسجيل كابتن جديد (ذاتي)
app.post("/captains/register", (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: "الاسم والموبايل مطلوبين" });
  }

  const captain = {
    id: captainIdCounter++,
    name,
    phone,
    activeTrips: 0,
    good: 0,
    bad: 0
  };

  captains.push(captain);

  res.json({
    message: "تم تسجيل الكابتن بنجاح",
    captain
  });
});

// عرض كل الكباتن
app.get("/captains", (req, res) => {
  res.json(captains);
});

// ================== TRIPS ==================

// إنشاء مشوار
app.post("/trips", (req, res) => {
  const { pickupCity, dropoffCity } = req.body;

  if (!pickupCity || !dropoffCity) {
    return res.status(400).json({ error: "حدد مدينة الاستلام والتسليم" });
  }

  const price =
    pickupCity === dropoffCity ? PRICE_SAME_CITY : PRICE_CROSS_CITY;

  const trip = {
    id: tripIdCounter++,
    pickupCity,
    dropoffCity,
    price,
    commission: COMMISSION,
    captainNet: price - COMMISSION,
    status: "PENDING",
    captainId: null
  };

  trips.push(trip);

  res.json({
    message: "تم إنشاء المشوار",
    trip
  });
});

// عرض كل المشاوير
app.get("/trips", (req, res) => {
  res.json(trips);
});

// ================== ACCEPT TRIP ==================
app.post("/trips/:id/accept", (req, res) => {
  const tripId = parseInt(req.params.id);
  const { captainId } = req.body;

  const trip = trips.find(t => t.id === tripId);
  const captain = captains.find(c => c.id === captainId);

  if (!trip) return res.status(404).json({ error: "المشوار غير موجود" });
  if (!captain) return res.status(404).json({ error: "الكابتن غير موجود" });

  if (trip.status !== "PENDING") {
    return res.status(400).json({ error: "المشوار اتقبل قبل كده" });
  }

  if (captain.activeTrips >= MAX_ACTIVE_TRIPS) {
    return res.status(400).json({ error: "الكابتن وصل للحد الأقصى" });
  }

  trip.status = "ACCEPTED";
  trip.captainId = captain.id;
  captain.activeTrips++;

  res.json({
    message: "تم قبول المشوار",
    trip
  });
});

// ================== COMPLETE TRIP ==================
app.post("/trips/:id/complete", (req, res) => {
  const tripId = parseInt(req.params.id);

  const trip = trips.find(t => t.id === tripId);
  if (!trip) return res.status(404).json({ error: "المشوار غير موجود" });

  if (trip.status !== "ACCEPTED") {
    return res.status(400).json({ error: "المشوار مش في حالة تنفيذ" });
  }

  const captain = captains.find(c => c.id === trip.captainId);
  if (captain) captain.activeTrips--;

  trip.status = "DONE";

  res.json({
    message: "تم إنهاء المشوار",
    trip
  });
});

// ================== RATE CAPTAIN ==================
app.post("/trips/:id/rate", (req, res) => {
  const tripId = parseInt(req.params.id);
  const { value } = req.body; // GOOD or BAD

  const trip = trips.find(t => t.id === tripId);
  if (!trip || trip.status !== "DONE") {
    return res.status(400).json({ error: "المشوار غير صالح للتقييم" });
  }

  const captain = captains.find(c => c.id === trip.captainId);
  if (!captain) return res.status(404).json({ error: "الكابتن غير موجود" });

  if (value === "GOOD") captain.good++;
  else if (value === "BAD") captain.bad++;
  else return res.status(400).json({ error: "التقييم غير صحيح" });

  res.json({
    message: "تم تسجيل التقييم",
    captain
  });
});

module.exports = app;
