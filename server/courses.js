// Router for handling courses
const express = require("express");
const coursesRouter = express.Router();

var db = require("./db.js");
let dbConnection = db.dbConnection;

// GET method for all the courses in Courses table
coursesRouter.get("/", function (req, res) {
  if (req.session && req.session.loggedIn) {
    dbConnection.query(
      "SELECT CourseID as courseId, CourseName AS name, DeptCode AS deptCode, CourseNumber AS courseNumber, CreditNumber AS credits, CourseDescription AS description FROM courses",
      function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
      }
    );
  } else {
    res.redirect("/login");
  }
});

// GET courses taken by user for specific semester
coursesRouter.get("/getStudentCoursesBySemester/:semesterId", function (req, res) {
  if (req.session && req.session.loggedIn) {
    var semesterId = req.params.semesterId;
    var sql = `SELECT Registrations.RegistrationID as registrationId, Courses.CourseName AS name, Courses.DeptCode AS deptCode, Courses.CourseNumber AS courseNumber, 
    CourseOfferings.Professor AS prof, Courses.CreditNumber AS credits, CourseOfferings.Capacity AS capacity, CourseOfferings.DaysOfWeek AS days, 
    CourseOfferings.Time AS time, CourseOfferings.Building AS building, CourseOfferings.Room AS room,
    (SELECT COUNT(*) FROM Registrations AS Reg WHERE Reg.OfferingID = CourseOfferings.OfferingID) as numberFilled
    FROM Courses, CourseOfferings, Registrations WHERE CourseOfferings.SemesterID = ? AND Courses.CourseID = CourseOfferings.CourseID 
    AND Registrations.OfferingID = CourseOfferings.OfferingID AND Registrations.StudentID = ?`;
    dbConnection.query(sql, [semesterId, req.session.userId], function (
      err,
      result,
      fields
    ) {
      if (err) throw err;
      res.send(JSON.stringify(result));
    });
  } else {
    res.redirect("/login");
  }
});

// GET courses not taken by user for specific semester
coursesRouter.get("/getNonStudentCoursesBySemester/:semesterId", function (req, res) {
  if (req.session && req.session.loggedIn) {
    var semesterId = req.params.semesterId;
    var sql = `SELECT DISTINCT Courses.CourseName AS name, CourseOfferings.OfferingID AS offeringId, Courses.DeptCode AS deptCode, Courses.CourseNumber AS courseNumber, 
    CourseOfferings.Professor AS prof, Courses.CreditNumber AS credits, CourseOfferings.Capacity AS capacity, CourseOfferings.DaysOfWeek AS days, 
    CourseOfferings.Time AS time, CourseOfferings.Building AS building, CourseOfferings.Room AS room,
    (SELECT COUNT(*) FROM Registrations AS Reg WHERE Reg.OfferingID = CourseOfferings.OfferingID) as numberFilled
    FROM Courses, CourseOfferings, Registrations WHERE CourseOfferings.SemesterID = ? AND Courses.CourseID = CourseOfferings.CourseID 
    AND NOT EXISTS (SELECT * FROM Registrations WHERE Registrations.StudentID = ? AND Registrations.OfferingID = CourseOfferings.OfferingID);`;

    dbConnection.query(sql, [semesterId, req.session.userId], function (
      err,
      result,
      fields
    ) {
      if (err) throw err;
      res.send(JSON.stringify(result));
    });
  } else {
    res.redirect("/login");
  }
});

// GET courses available for a given semester
coursesRouter.get("/getCoursesBySemester/:semesterId", function (req, res) {
  if (req.session && req.session.loggedIn) {
    var semesterId = req.params.semesterId;
    var sql = `SELECT CourseOfferings.OfferingID as offeringId, CourseOfferings.Capacity as capacity, 
    Courses.CourseName AS name, Courses.DeptCode AS deptCode, Courses.CourseNumber AS courseNumber, 
    CourseOfferings.Professor AS prof, Courses.CreditNumber AS credits, CourseOfferings.DaysOfWeek AS days, 
    CourseOfferings.Time AS time, CourseOfferings.Building AS building, CourseOfferings.OfferingID as offeringId, CourseOfferings.Room AS room, 
    (SELECT COUNT(*) FROM Registrations AS Reg WHERE Reg.OfferingID = CourseOfferings.OfferingID) as numberFilled From CourseOfferings, 
    Courses Where CourseOfferings.SemesterID = ? AND Courses.CourseID = CourseOfferings.CourseID`;
    dbConnection.query(sql, [semesterId], function (err, result, fields) {
      if (err) throw err;
      res.send(JSON.stringify(result));
    });
  } else {
    res.redirect("/login");
  }
});

// POST method to add course
// Used on Course Maintenance page
coursesRouter.post("/addCourse", function (req, res) {
  var sql =
    "INSERT INTO Courses (DeptCode, CourseNumber, CourseName, CreditNumber, CourseDescription) VALUES (?, ?, ?, ?, ?)";
  var args = [
    req.body.deptCode,
    req.body.number,
    req.body.name,
    req.body.credits,
    req.body.desc,
  ];
  dbConnection.query(sql, args, function (err, result, fields) {
    res.json({ isCourseAdded: true });
  });
});

// POST method to edit course
// Used on Course Maintenance page
coursesRouter.post("/editCourse", function (req, res) {
  var sql =
    "UPDATE Courses SET DeptCode = ?, CourseNumber = ?, CourseName = ?, CreditNumber = ?, CourseDescription =? WHERE CourseID = ?";
  var args = [
    req.body.deptCode,
    req.body.number,
    req.body.name,
    req.body.credits,
    req.body.desc,
    req.body.id,
  ];
  dbConnection.query(sql, args, function (err, result, fields) {
    res.json({ isCourseEdited: true });
  });
});

// POST method to delete course
// Used on Course Maintenance page
coursesRouter.post("/deleteCourse", function (req, res) {
  var checkCourseUsageSql = "SELECT * FROM CourseOfferings WHERE CourseID = ?";
  var args = [req.body.id];
  dbConnection.query(checkCourseUsageSql, args, function (err, result, fields) {
    if (result.length != 0) {
      res.json({ isCourseDeleted: false });
    } else {
      var deleteCourseSql = "DELETE FROM Courses WHERE CourseID = ?";
      dbConnection.query(deleteCourseSql, args, function (err, result, fields) {
        res.json({ isCourseDeleted: true });
      });
    }
  });
});
