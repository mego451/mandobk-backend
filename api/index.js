const express = require("express");
const app = express();

app.use(express.json());

// ================== CONSTANTS ==================
const PRICE_SAME_CITY = 25;
const PRICE_CROSS_CITY = 45;
const COMMISSION = 5;
const MAX_ACTIVE_TRIPS = 5;

// ================== DATA (IN MEMORY) ==================
let trips = [];
let captains = [
  { id: 1, name: "Captain Magdy", activeTrips: 0, good: 0, bad: 0 },
  { id: 2, name: "Captain Ahmed", activeTrips: 0, good: 0, bad: 0 }
];

let tripIdCounter = 1;

// ================== ROOT ==================
app.get("/", (req, res) => {
  res.json({ message: "Mandobk backend شغال 🚀" });
});

// ================== CREATE TRIP ==================
app.get("/trips/create", (req, res) => {
  const { pickupCity, dropoffCity } = req.query;

  if (!pickupCity || !dropoffCity) {
    return res.json({ error: "حدد pickupCity و dropoffCity" });
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

  res.json({ message: "تم إنشاء المشوار", trip });
});

// ================== LIST TRIPS ==================
app.get("/trips", (req, res) => {
  res.json(trips);
});

// ================== LIST CAPTAINS ==================
app.get("/captains", (req, res) => {
  res.json(captains);
});

// ================== ACCEPT TRIP ==================
app.post("/trips/:id/accept", (req, res) => {
  const tripId = parseInt(req.params.id);
  const { captainId } = req.body;

  const trip = trips.find(t => t.id === tripId);
  const captain = captains.find(c => c.id === captainId);

  if (!trip) return res.json({ error: "المشوار مش موجود" });
  if (!captain) return res.json({ error: "الكابتن مش موجود" });

  if (trip.status !== "PENDING") {
    return res.json({ error: "المشوار اتقبل قبل كده" });
  }

  if (captain.activeTrips >= MAX_ACTIVE_TRIPS) {
    return res.json({ error: "الكابتن وصل لحد 5 مشاوير" });
  }

  trip.status = "ACCEPTED";
  trip.captainId = captain.id;
  captain.activeTrips++;

  res.json({ message: "تم قبول المشوار", trip });
});

// ================== COMPLETE TRIP ==================
app.post("/trips/:id/complete", (req, res) => {
  const tripId = parseInt(req.params.id);
  const trip = trips.find(t => t.id === tripId);

  if (!trip || trip.status !== "ACCEPTED") {
    return res.json({ error: "المشوار غير صالح للإنهاء" });
  }

  const captain = captains.find(c => c.id === trip.captainId);
  if (captain) captain.activeTrips--;

  trip.status = "DONE";

  res.json({ message: "تم إنهاء المشوار", trip });
});

// ================== RATE CAPTAIN ==================
app.post("/trips/:id/rate", (req, res) => {
  const tripId = parseInt(req.params.id);
  const { value } = req.body; // GOOD or BAD

  const trip = trips.find(t => t.id === tripId);
  if (!trip || trip.status !== "DONE") {
    return res.json({ error: "المشوار مش جاهز للتقييم" });
  }

  const captain = captains.find(c => c.id === trip.captainId);
  if (!captain) return res.json({ error: "الكابتن مش موجود" });

  if (value === "GOOD") captain.good++;
  else if (value === "BAD") captain.bad++;
  else return res.json({ error: "قيمة التقييم غلط" });

  res.json({ message: "تم التقييم", captain });
});

module.exports = app;
