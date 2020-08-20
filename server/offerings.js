// Router for handling offerings
const express = require("express");
const offeringsRouter = express.Router();

var db = require("./db.js");
let dbConnection = db.dbConnection;

// POST method to delete course offering
// Used on Course Maintenance page
offeringsRouter.post("/deleteOffering", function (req, res) {
  var checkRegistrationUsageSql =
    "SELECT * FROM Registrations WHERE OfferingID = ?";
  dbConnection.query(checkRegistrationUsageSql, args, function (
    err,
    result,
    fields
  ) {
    if (result.length != 0) {
      res.json({ isOfferingDeleted: false });
    } else {
      var deleteOfferingSql =
        "DELETE FROM CourseOfferings WHERE OfferingID = ?";
      dbConnection.query(deleteOfferingSql, args, function (
        err,
        result,
        fields
      ) {
        res.json({ isOfferingDeleted: true });
      });
    }
  });
});

// POST method to edit offering
// Use on Course Maintenance page
offeringsRouter.post("/editOffering", function (req, res) {
  var sql =
    "UPDATE CourseOfferings SET Professor = ?, SemesterID = ?, DaysOfWeek = ?, Time = ?, Building = ?, Room = ?, Capacity = ? WHERE OfferingID = ?";
  var args = [
    req.body.prof,
    req.body.semesters,
    req.body.days,
    req.body.time,
    req.body.building,
    req.body.room,
    req.body.capacity,
    req.body.id,
  ];
  dbConnection.query(sql, args, function (err, result, fields) {
    res.json({ isOfferingEdited: true });
  });
});

// POST method to add offering
// Used on Course Maintenance page
offeringsRouter.post("/addOffering", function (req, res) {
  var sql =
    "INSERT INTO CourseOfferings (CourseID, SemesterID, Professor, DaysOfWeek, Time, Building, Room, Capacity) VALUES (?,?,?,?,?,?,?,?)";
  var args = [
    req.body.id,
    req.body.semesters,
    req.body.prof,
    req.body.days,
    req.body.time,
    req.body.building,
    req.body.room,
    req.body.capacity,
  ];
  dbConnection.query(sql, args, function (err, result, fields) {
    res.json({ isOfferingAdded: true });
  });
});
