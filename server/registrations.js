// Router for handling registrations
const express = require("express");
const registrationsRouter = express.Router();

var db = require("./db.js");
let dbConnection = db.dbConnection;

// POST method to delete student's registration
// Used on Build Schedule page
registrationsRouter.post("/deleteFromSchedule", function (req, res) {
  var sql = "DELETE FROM Registrations WHERE RegistrationID = ?";
  var args = [req.body.id];
  dbConnection.query(sql, args, function (err, result, fields) {
    res.sendStatus(200);
  });
});

// POST method to add to student's registration
// Used on Build Schedule page
registrationsRouter.post("/addToSchedule", function (req, res) {
  var sql = "INSERT INTO Registrations (StudentID, OfferingID) VALUES (?,?)";
  var args = [req.session.userId, req.body.id];
  dbConnection.query(sql, args, function (err, result, fields) {
    res.sendStatus(200);
  });
});

// Use in index.js

module.exports = registrationsRouter;