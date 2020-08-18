// Include the needed modules and create express application
var express = require("express");

var app = express();

var bodyparser = require("body-parser");
var fs = require("fs");
var session = require("express-session");
var crypto = require("crypto");
var mysql = require("mysql");
var xml2js = require("xml2js");

// apply the body-parser middleware to all incoming requests
app.use(bodyparser());

// Access files in public folder
app.use(express.static("public"));

// Use express-session
app.use(
  session({
    secret: "robotspacetruck",
    saveUninitialized: true,
    resave: false,
  })
);

// Set up parser to parse xml
var parser = new xml2js.Parser();
var dbInfo;
var con;

// Create the database connection using the parser
fs.readFile(__dirname + "/dbconfig.xml", function (err, data) {
  if (err) throw err;
  parser.parseString(data, function (err, result) {
    if (err) throw err;
    dbInfo = result;
    //Establish DB connection
    con = mysql.createConnection({
      host: dbInfo.dbconfig.host[0],
      user: dbInfo.dbconfig.user[0],
      password: dbInfo.dbconfig.password[0],
      database: dbInfo.dbconfig.database[0],
      port: dbInfo.dbconfig.port[0],
    });
    con.connect(function (err) {
      if (err) throw err;
      console.log("Connected!");
    });
  });
});

// server listens on port 9306 for incoming connections
app.listen(9306, () => console.log("Listening on port 9306!"));

// GET method for home page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/client/home.html");
});

// GET method route for the Schedule page
// Must be logged in and student user
app.get("/schedule", function (req, res) {
  if (req.session && req.session.loggedIn && !req.session.isAdmin) {
    res.sendFile(__dirname + "/client/schedule.html");
  } else {
    res.redirect("/login");
  }
});

// GET method route for the Admin page
// Must be logged in and admin user
app.get("/admin", function (req, res) {
  if (req.session && req.session.loggedIn && req.session.isAdmin) {
    res.sendFile(__dirname + "/client/admin.html");
  } else {
    res.redirect("/login");
  }
});

// GET method route for the Course Maintenance page
// Must be logged in and admin user
app.get("/courseMaintenance", function (req, res) {
  if (req.session && req.session.loggedIn && req.session.isAdmin) {
    res.sendFile(__dirname + "/client/courseMaintenance.html");
  } else {
    res.redirect("/login");
  }
});

// GET method route for the Build Schedule page
// Must be logged in and student user
app.get("/buildSchedule", function (req, res) {
  if (req.session && req.session.loggedIn && !req.session.isAdmin) {
    res.sendFile(__dirname + "/client/buildSchedule.html");
  } else {
    res.redirect("/login");
  }
});

// GET method route for the View Courses page
// Must be logged in
// Seen by both student and admin users
app.get("/viewCourses", function (req, res) {
  if (req.session && req.session.loggedIn) {
    res.sendFile(__dirname + "/client/viewCourses.html");
  } else {
    res.redirect("/login");
  }
});

// GET method route for the login page.
// If the user isn't signed in, it serves login.html present in client folder
// Otherwise, it routes the user to the correct page depending if they are admin user or not
app.get("/login", function (req, res) {
  if (req.session && req.session.loggedIn && req.session.isAdmin) {
    res.redirect("/admin");
  } else if (req.session && req.session.loggedIn) {
    res.redirect("/schedule");
  } else {
    res.sendFile(__dirname + "/client/login.html");
  }
});

// POST method to edit user on Admin page
app.post("/editUser", function (req, res) {
  var loginSql = "SELECT * FROM Users WHERE UserLogin = ? AND UserID <> ?";
  con.query(loginSql, [req.body.login, parseInt(req.body.userId)], function (
    err,
    result,
    fields
  ) {
    if (err) throw error;
    // Login is already in table
    if (result.length !== 0) {
      res.json({ isLoginTaken: true });
    } else {
      // Login is not already in table
      // Change type of user from admin or not to 1 or 0 that is stored in table
      var isAdmin = req.body.userType == "admin" ? 1 : 0;
      var sql;
      var args = [req.body.login, req.body.name, isAdmin];
      // Don't change the password if a new one isn't sent (password not required on Edit User modal)
      if (req.body.password == "") {
        sql =
          "UPDATE Users SET UserLogin = ?, UserName = ?, isAdmin = ? WHERE UserID = ?";
      } else {
        sql =
          "UPDATE Users SET UserLogin = ?, UserName = ?, isAdmin = ?, UserPassword = ? WHERE UserID = ?";
        var hashed_pwd = crypto
          .createHash("sha256")
          .update(req.body.password)
          .digest("base64");
        args.push(hashed_pwd);
      }
      id = parseInt(req.body.userId);
      args.push(id);
      // Use sql statement found and arguments array
      con.query(sql, args, function (err, result, fields) {
        // Send that it worked
        res.json({ isLoginTaken: false });
      });
    }
  });
});

// POST method to add user on Admin page
app.post("/addUser", function (req, res) {
  // Change type of user to 0 or 1
  var isAdmin = req.body.userType == "admin" ? 1 : 0;
  // Hash the password
  var hashed_pwd = crypto
    .createHash("sha256")
    .update(req.body.password)
    .digest("base64");
  // Check if user login already in table
  // Only one user can have a given user login
  var loginSql = "SELECT * FROM Users WHERE UserLogin = ?";
  con.query(loginSql, [req.body.login], function (err, result, fields) {
    if (err) throw error;
    // Login is already in table
    if (result.length !== 0) {
      res.json({ isLoginTaken: true });
    } else {
      // Login is not already in table
      // Insert information into Users table
      var sql =
        "INSERT INTO Users (UserLogin, UserName, UserPassword, isAdmin) VALUES (?, ?, ?, ?)";
      var args = [req.body.login, req.body.name, hashed_pwd, isAdmin];
      con.query(sql, args, function (err, result, fields) {
        if (err) throw err;
        res.json({ isLoginTaken: false });
      });
    }
  });
});

// POST method to delete user on Admin page
app.post("/deleteUser", function (req, res) {
  // Delete the user with the specified ID
  if (req.session.userId != req.body.id) {
    var sql = "DELETE FROM Users WHERE UserID = ?";
    var args = [req.body.id];
    con.query(sql, args, function (err, result, fields) {
      res.json({ isDeleted: true });
    });
  }
  // Error if trying to delete currently logged in user
  else {
    res.json({ isDeleted: false });
  }
});

// POST method to validate user login
// Upon successful login, user session is created
app.post("/validateLogin", function (req, res) {
  // Find username and hashed password
  var username = req.body.username;
  var pwd = req.body.password;
  var hashed_pwd = crypto.createHash("sha256").update(pwd).digest("base64");
  var sql = "SELECT * FROM Users WHERE UserLogin = ? AND UserPassword = ?";
  // Determine if corresponding entry exists in Users table
  con.query(sql, [username, hashed_pwd], function (err, result, fields) {
    var user = JSON.parse(JSON.stringify(result));
    // Determine if validation successful or not
    if (err) throw err;
    else if (result.length == 0) {
      // User still needs to login
      console.log("Validation failed!");
      req.session.flag = 0;
      res.redirect("/login");
    } else {
      // User has logged in and session variables are set
      console.log("Validation successful!");
      req.session.login = username;
      req.session.loggedIn = true;
      req.session.flag = 1;
      req.session.userId = user[0].UserID;
      req.session.name = user[0].UserName;
      // Check if the user is a student or admin and redirect to appropriate page
      if (user[0].isAdmin == 1) {
        // Admin user
        req.session.isAdmin = true;
        res.redirect("/admin");
      } else {
        // Student user
        req.session.isAdmin = false;
        res.redirect("/schedule");
      }
    }
  });
});

// Determine is user is admin
// Used to determine how the navigation bar is displayed
app.get("/getIsAdmin", function (req, res) {
  if (req.session.isAdmin) {
    res.json({ isAdmin: true });
  } else {
    res.json({ isAdmin: false });
  }
});

// GET method used by login.html to determine if error message should be displayed
// Sends the value of the session variable flag to show login status
app.get("/getLoginStatus", function (req, res) {
  if (req.session.flag == 0 || req.session.flag == 1) {
    res.json({ flag: req.session.flag });
  } else {
    var flagNotSet = -1;
    res.json({ flag: flagNotSet });
  }
});

// GET method for all the courses in Courses table
app.get("/getAllCourses", function (req, res) {
  if (req.session && req.session.loggedIn) {
    con.query(
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

// GET all users from Users table
app.get("/getUsers", function (req, res) {
  if (req.session && req.session.loggedIn) {
    con.query(
      "SELECT UserID AS userId, UserName AS name, UserLogin AS login, isAdmin FROM Users",
      function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
      }
    );
  } else {
    res.redirect("/login");
  }
});

// GET all semesters from Semesters table
app.get("/getSemesters", function (req, res) {
  if (req.session && req.session.loggedIn) {
    con.query(
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
app.post("/addSemester", function (req, res) {
  // Change the how recent semester is to 1 or 0, not true or false
  var isRecent = req.body.recentType == "true" ? 1 : 0;
  var sql = "INSERT INTO Semesters (Season, Year, isRecent) VALUES (?, ?, ?)";
  var args = [req.body.season, req.body.year, isRecent];
  con.query(sql, args, function (err, result, fields) {
    res.redirect("/courseMaintenance");
  });
});

// POST method to edit semester with specified ID
// Used on Course Maintenance page
app.post("/editSemester", function (req, res) {
  // Change the how recent semester is to 1 or 0, not true or false
  var isRecent = req.body.recentType == "true" ? 1 : 0;
  var sql =
    "UPDATE Semesters SET Season = ?, Year = ?, isRecent = ? WHERE SemesterID = ?";
  id = parseInt(req.body.semesterId);
  var args = [req.body.season, req.body.year, isRecent, id];
  con.query(sql, args, function (err, result, fields) {
    res.redirect("/courseMaintenance");
  });
});

// POST method to delete semester with specified ID
// Used on Course Maintenance page
app.post("/deleteSemester", function (req, res) {
  var sql = "DELETE FROM Semesters WHERE SemesterID = ?";
  var args = [req.body.id];
  con.query(sql, args, function (err, result, fields) {
    res.sendStatus(200);
  });
});

// GET method for recent semesters
// These are semesters where students can add/delete courses to/from their schedule
app.get("/getRecentSemesters", function (req, res) {
  if (req.session && req.session.loggedIn) {
    con.query(
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
app.get("/getStudentSemesters", function (req, res) {
  if (req.session && req.session.loggedIn) {
    var sql =
      "SELECT DISTINCT Semesters.SemesterID as semesterId, Semesters.Season AS season, Semesters.Year AS year, CourseOfferings.OfferingID as offeringId FROM Semesters, \
    CourseOfferings, Registrations WHERE CourseOfferings.SemesterID = Semesters.SemesterID  \
    AND Registrations.OfferingID = CourseOfferings.OfferingID AND Registrations.StudentID = ? GROUP BY semesterId";
    con.query(sql, [req.session.userId], function (err, result, fields) {
      if (err) throw err;
      res.send(JSON.stringify(result));
    });
  } else {
    res.redirect("/login");
  }
});

// GET courses taken by user for specific semester
app.get("/getStudentCoursesBySemester/:semesterId", function (req, res) {
  if (req.session && req.session.loggedIn) {
    var semesterId = req.params.semesterId;
    var sql = `SELECT Registrations.RegistrationID as registrationId, Courses.CourseName AS name, Courses.DeptCode AS deptCode, Courses.CourseNumber AS courseNumber, 
    CourseOfferings.Professor AS prof, Courses.CreditNumber AS credits, CourseOfferings.Capacity AS capacity, CourseOfferings.DaysOfWeek AS days, 
    CourseOfferings.Time AS time, CourseOfferings.Building AS building, CourseOfferings.Room AS room,
    (SELECT COUNT(*) FROM Registrations AS Reg WHERE Reg.OfferingID = CourseOfferings.OfferingID) as numberFilled
    FROM Courses, CourseOfferings, Registrations WHERE CourseOfferings.SemesterID = ? AND Courses.CourseID = CourseOfferings.CourseID 
    AND Registrations.OfferingID = CourseOfferings.OfferingID AND Registrations.StudentID = ?`;
    con.query(sql, [semesterId, req.session.userId], function (
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
app.get("/getNonStudentCoursesBySemester/:semesterId", function (req, res) {
  if (req.session && req.session.loggedIn) {
    var semesterId = req.params.semesterId;
    var sql = `SELECT DISTINCT Courses.CourseName AS name, CourseOfferings.OfferingID AS offeringId, Courses.DeptCode AS deptCode, Courses.CourseNumber AS courseNumber, 
    CourseOfferings.Professor AS prof, Courses.CreditNumber AS credits, CourseOfferings.Capacity AS capacity, CourseOfferings.DaysOfWeek AS days, 
    CourseOfferings.Time AS time, CourseOfferings.Building AS building, CourseOfferings.Room AS room,
    (SELECT COUNT(*) FROM Registrations AS Reg WHERE Reg.OfferingID = CourseOfferings.OfferingID) as numberFilled
    FROM Courses, CourseOfferings, Registrations WHERE CourseOfferings.SemesterID = ? AND Courses.CourseID = CourseOfferings.CourseID 
    AND NOT EXISTS (SELECT * FROM Registrations WHERE Registrations.StudentID = ? AND Registrations.OfferingID = CourseOfferings.OfferingID);`;

    con.query(sql, [semesterId, req.session.userId], function (
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
app.get("/getCoursesBySemester/:semesterId", function (req, res) {
  if (req.session && req.session.loggedIn) {
    var semesterId = req.params.semesterId;
    var sql = `SELECT CourseOfferings.OfferingID as offeringId, CourseOfferings.Capacity as capacity, 
    Courses.CourseName AS name, Courses.DeptCode AS deptCode, Courses.CourseNumber AS courseNumber, 
    CourseOfferings.Professor AS prof, Courses.CreditNumber AS credits, CourseOfferings.DaysOfWeek AS days, 
    CourseOfferings.Time AS time, CourseOfferings.Building AS building, CourseOfferings.OfferingID as offeringId, CourseOfferings.Room AS room, 
    (SELECT COUNT(*) FROM Registrations AS Reg WHERE Reg.OfferingID = CourseOfferings.OfferingID) as numberFilled From CourseOfferings, 
    Courses Where CourseOfferings.SemesterID = ? AND Courses.CourseID = CourseOfferings.CourseID`;
    con.query(sql, [semesterId], function (err, result, fields) {
      if (err) throw err;
      res.send(JSON.stringify(result));
    });
  } else {
    res.redirect("/login");
  }
});

// POST method to add course
// Used on Course Maintenance page
app.post("/addCourse", function (req, res) {
  var sql =
    "INSERT INTO Courses (DeptCode, CourseNumber, CourseName, CreditNumber, CourseDescription) VALUES (?, ?, ?, ?, ?)";
  var args = [
    req.body.deptCode,
    req.body.number,
    req.body.name,
    req.body.credits,
    req.body.desc,
  ];
  con.query(sql, args, function (err, result, fields) {
    res.redirect("/courseMaintenance");
  });
});

// POST method to edit course
// Used on Course Maintenance page
app.post("/editCourse", function (req, res) {
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
  con.query(sql, args, function (err, result, fields) {
    res.redirect("/courseMaintenance");
  });
});

// POST method to delete course
// Used on Course Maintenance page
app.post("/deleteCourse", function (req, res) {
  var sql = "DELETE FROM Courses WHERE CourseID = ?";
  var args = [req.body.id];
  con.query(sql, args, function (err, result, fields) {
    res.sendStatus(200);
  });
});

// POST method to delete student's registration
// Used on Build Schedule page
app.post("/deleteFromSchedule", function (req, res) {
  var sql = "DELETE FROM Registrations WHERE RegistrationID = ?";
  var args = [req.body.id];
  con.query(sql, args, function (err, result, fields) {
    res.sendStatus(200);
  });
});

// POST method to add to student's registration
// Used on Build Schedule page
app.post("/addToSchedule", function (req, res) {
  var sql = "INSERT INTO Registrations (StudentID, OfferingID) VALUES (?,?)";
  var args = [req.session.userId, req.body.id];
  con.query(sql, args, function (err, result, fields) {
    res.sendStatus(200);
  });
});

// POST method to delete course offering
// Used on Course Maintenance page
app.post("/deleteOffering", function (req, res) {
  var sql = "DELETE FROM CourseOfferings WHERE OfferingID = ?";
  var args = [req.body.id];
  con.query(sql, args, function (err, result, fields) {
    res.sendStatus(200);
  });
});

// POST method to edit offering
// Use on Course Maintenance page
app.post("/editOffering", function (req, res) {
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
  con.query(sql, args, function (err, result, fields) {
    res.redirect("/courseMaintenance");
  });
});

// POST method to add offering
// Used on Course Maintenance page
app.post("/addOffering", function (req, res) {
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
  con.query(sql, args, function (err, result, fields) {
    res.redirect("/courseMaintenance");
  });
});

// Logout and show Login page
app.get("/logout", function (req, res) {
  if (!req.session.loggedIn) {
    console.log("Session not started, cannot logout");
  } else {
    req.session.destroy();
    res.redirect("/login");
  }
});

// Send 404 message for other routes
app.get("*", function (req, res) {
  res.status(404).send("ERROR: 404 Not Found");
});
