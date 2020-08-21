// Router for handling semesters
const express = require("express");
const semestersRouter = express.Router();

var db = require("./db.js");
let dbConnection = db.dbConnection;

// GET all semesters from Semesters table
semestersRouter.get("/", function (req, res) {
  if (req.session && req.session.loggedIn) {
    dbConnection.query(
      "SELECT SemesterID as semesterId, Season AS season, Year AS year, isRecent FROM Semesters",
      function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
      }
    );
  } else {
    res.redirect("/login");
  }
});

// POST method to add semester to Semesters table
// Used on Course Maintenance page
semestersRouter.post("/addSemester", function (req, res) {
  // Change the how recent semester is to 1 or 0, not true or false
  var isRecent = req.body.recentType == "true" ? 1 : 0;
  var sql = "INSERT INTO Semesters (Season, Year, isRecent) VALUES (?, ?, ?)";
  var args = [req.body.season, req.body.year, isRecent];
  dbConnection.query(sql, args, function (err, result, fields) {
    res.json({ isSemesterAdded: true });
  });
});

// POST method to edit semester with specified ID
// Used on Course Maintenance page
semestersRouter.post("/editSemester", function (req, res) {
  // Change the how recent semester is to 1 or 0, not true or false
  var isRecent = req.body.recentType == "true" ? 1 : 0;
  var sql =
    "UPDATE Semesters SET Season = ?, Year = ?, isRecent = ? WHERE SemesterID = ?";
  id = parseInt(req.body.semesterId);
  var args = [req.body.season, req.body.year, isRecent, id];
  dbConnection.query(sql, args, function (err, result, fields) {
    res.json({ isSemesterEdited: true });
  });
});

// POST method to delete semester with specified ID
// Used on Course Maintenance page
semestersRouter.post("/deleteSemester", function (req, res) {
  var checkSemesterUsageSql =
    "SELECT * FROM CourseOfferings WHERE SemesterID = ?";
  var args = [req.body.id];
  dbConnection.query(checkSemesterUsageSql, args, function (err, result, fields) {
    if (result.length != 0) {
      res.json({ isSemesterDeleted: false });
    } else {
      var deleteSemesterSql = "DELETE FROM Semesters WHERE SemesterID = ?";
      dbConnection.query(deleteSemesterSql, args, function (err, result, fields) {
        res.json({ isSemesterDeleted: true });
      });
    }
  });
});

// GET method for recent semesters
// These are semesters where students can add/delete courses to/from their schedule
semestersRouter.get("/recentSemesters", function (req, res) {
  if (req.session && req.session.loggedIn) {
    dbConnection.query(
      "SELECT SemesterID as semesterId, Season AS season, Year AS year, isRecent FROM Semesters WHERE isRecent=1",
      function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
      }
    );
  } else {
    res.redirect("/login");
  }
});

// GET semesters for specific user
// Only retrieve semesters where a user takes a course
// Used by Schedule page
semestersRouter.get("/studentSemesters", function (req, res) {
  if (req.session && req.session.loggedIn) {
    var sql =
      "SELECT DISTINCT Semesters.SemesterID as semesterId, Semesters.Season AS season, Semesters.Year AS year, CourseOfferings.OfferingID as offeringId FROM Semesters, \
    CourseOfferings, Registrations WHERE CourseOfferings.SemesterID = Semesters.SemesterID  \
    AND Registrations.OfferingID = CourseOfferings.OfferingID AND Registrations.StudentID = ? GROUP BY semesterId";
    dbConnection.query(sql, [req.session.userId], function (err, result, fields) {
      if (err) throw err;
      res.send(JSON.stringify(result));
    });
  } else {
    res.redirect("/login");
  }
});

// Use in index.js

module.exports = semestersRouter;