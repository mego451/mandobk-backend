const express = require("express");
const app = express();

app.use(express.json());

// ================== DATA (مؤقت) ==================
let trips = [];
let captains = [
  { id: 1, name: "Captain Ali", activeTrips: 0 },
  { id: 2, name: "Captain Ahmed", activeTrips: 0 }
];

let tripIdCounter = 1;
const MAX_ACTIVE_TRIPS = 5;
const COMMISSION = 5;

// ================== ROUTES ==================

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.send("Mandobk backend شغال 🚀");
});

// إنشاء مشوار (GET للتجربة)
app.get("/trips", (req, res) => {
  const { pickupCity, dropoffCity } = req.query;

  if (!pickupCity || !dropoffCity) {
    return res.json({
      message: "حط pickupCity و dropoffCity في اللينك"
    });
  }

  let price = pickupCity === dropoffCity ? 25 : 45;

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
    message: "مشوار Mandobk اتعمل",
    trip
  });
});

// عرض كل المشاوير
app.get("/trips/all", (req, res) => {
  res.json(trips);
});

// ================== قبول الكابتن للمشوار ==================
app.post("/trips/:tripId/accept", (req, res) => {
  const tripId = parseInt(req.params.tripId);
  const { captainId } = req.body;

  const trip = trips.find(t => t.id === tripId);
  const captain = captains.find(c => c.id === captainId);

  if (!trip) {
    return res.status(404).json({ error: "المشوار مش موجود" });
  }

  if (trip.status !== "PENDING") {
    return res.status(400).json({ error: "المشوار اتقبل قبل كده" });
  }

  if (!captain) {
    return res.status(404).json({ error: "الكابتن مش موجود" });
  }

  if (captain.activeTrips >= MAX_ACTIVE_TRIPS) {
    return res.status(400).json({
      error: "الكابتن واصل للحد الأقصى من المشاوير"
    });
  }

  // قبول المشوار
  trip.status = "ACCEPTED";
  trip.captainId = captain.id;
  captain.activeTrips++;

  res.json({
    message: "الكابتن قبل المشوار",
    trip,
    captain
  });
});

// ================== عرض الكباتن ==================
app.get("/captains", (req, res) => {
  res.json(captains);
});

module.exports = app;
