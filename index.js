// include the needed modules
var express = require("express");

// create an express application
var app = express();

var bodyparser = require('body-parser');

var fs = require("fs");

var session = require('express-session');

var crypto = require('crypto');

var mysql = require("mysql");

var xml2js = require('xml2js');

// apply the body-parser middleware to all incoming requests
app.use(bodyparser());

// used to access css
app.use(express.static('public'));

// use express-session
app.use(session({
  secret: "robotspacetruck", 
  saveUninitialized: true,
  resave: false}
));


var parser = new xml2js.Parser();
var dbInfo;
var con;

// Create the database connection by parsing xml
fs.readFile(__dirname + '/dbconfig.xml', function(err, data) {
	if (err) throw err;
    parser.parseString(data, function (err, result) {
		    if (err) throw err;
        dbInfo = result;
        //Establish DB connection
        con = mysql.createConnection({
          host: dbInfo.dbconfig.host[0],
          user:  dbInfo.dbconfig.user[0], 
          password: dbInfo.dbconfig.password[0], 
          database:  dbInfo.dbconfig.database[0], 
          port:  dbInfo.dbconfig.port[0]
        });
        con.connect(function(err) {
          if (err) throw err;
          console.log("Connected!");
        });
	});
});

// server listens on port 9306 for incoming connections
app.listen(9306, () => console.log('Listening on port 9306!'));

// GET method for home page
app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/home.html');
});

// GET method route for the Schedule page
app.get('/schedule',function(req, res) {
  if (req.session && req.session.loggedIn) {
    res.sendFile(__dirname + '/client/schedule.html');
  }
  else {
    res.redirect("/login");
  }
});

// GET method route for the Admin page.
app.get('/admin',function(req, res) {
  if (req.session && req.session.loggedIn && req.session.isAdmin) {
    res.sendFile(__dirname + '/client/admin.html');
  }
  else {
    res.redirect("/login");
  }
});

// GET method route for the Change Courses page.
app.get('/changeCourses',function(req, res) {
  if (req.session && req.session.loggedIn) {
    res.sendFile(__dirname + '/client/changeCourses.html');
  }
  else {
    res.redirect("/login");
  }
});

// GET method route for the Build Schedule page.
app.get('/buildSchedule',function(req, res) {
  if (req.session && req.session.loggedIn) {
    res.sendFile(__dirname + '/client/buildSchedule.html');
  }
  else {
    res.redirect("/login");
  }
});

// GET method route for the navigation bar
app.get('/navigationBar',function(req, res) {
  if (req.session && req.session.loggedIn) {
    res.sendFile(__dirname + '/client/navigationBar.html');
  }
  else {
    res.redirect("/login");
  }
});

// GET method route for the View Courses page.
app.get('/viewCourses',function(req, res) {
  if (req.session && req.session.loggedIn) {
    res.sendFile(__dirname + '/client/viewCourses.html');
  }
  else {
    res.redirect("/login");
  }
});

// GET method route for the login page.
// It serves login.html present in client folder
app.get('/login',function(req, res) {
  if (req.session && req.session.loggedIn && req.session.isAdmin) {
    res.redirect('/admin');
  }
  else if (req.session && req.session.loggedIn) {
	res.redirect('/schedule');
  }
  else {
    res.sendFile(__dirname + '/client/login.html');
  }
});

// POST method to validate user login
// Upon successful login, user session is created
app.post('/validateLogin', function(req, res) {
  var user = req.body.username;
  var pwd = req.body.password;
  var hashed_pwd = crypto.createHash('sha256').update(pwd).digest('base64');
  var sql= "SELECT * FROM Users WHERE UserLogin = ? AND UserPassword = ?";
  con.query(sql, [user, hashed_pwd], function(err, result, fields) {
      var obj = JSON.parse(JSON.stringify(result));
      // Determine if validation successful or not
      if (err) throw err;
      else if (result.length == 0) {
        console.log("Validation failed!");
        req.session.flag = 0;
        res.redirect("/login");
      }
      else  {
        console.log("Validation successful!");
        req.session.login = user;
        req.session.loggedIn = true;
        req.session.flag = 1;
        req.session.userId = obj[0].UserID;
        req.session.name = obj[0].UserName;
        // Check if the user is a student or admin
        if (obj[0].isAdmin == 1) {
          // Admin user
          req.session.isAdmin = true;
          res.redirect("/admin");
        }
        else {
          // Student user
          req.session.isAdmin = false;
          res.redirect("/schedule");
        }
      }
    });
});

// Determine is user is admin 
// Used to determine what navbar displays
app.get('/getIsAdmin', function(req, res) {
  if (req.session.isAdmin) {
    res.json({isAdmin: true});
  }
  else {
    res.json({isAdmin: false});
  }
});

// GET method used by login.html to determine if error message should be displayed
// Sends the value of the session variable flag
app.get('/getFlag', function(req, res) {
  if (req.session.flag == 0 || req.session.flag == 1) {
    res.json({flag: req.session.flag});
  }
  else {
    var flagNotSet = -1;
    res.json({flag: flagNotSet});
  }
});

// Get method for all the courses
app.get('/getAllCourses', function(req, res) {
  if (req.session && req.session.loggedIn) {
    con.query("SELECT CourseID as courseId, CourseName AS name, DeptCode AS deptCode, CourseNumber AS courseNumber, CreditNumber AS credits, CourseDescription AS description FROM courses",
      function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
      });
  }
  else {
    res.redirect("/login");
  }
});

// GET users
app.get('/getUsers', function(req, res) {
  if (req.session && req.session.loggedIn) {
    con.query("SELECT UserID AS userId, UserName AS name, UserLogin AS login, isAdmin FROM Users",
      function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
      });
  }
  else {
    res.redirect("/login");
  }
});

// GET semesters
app.get('/getSemesters', function(req, res) {
  if (req.session && req.session.loggedIn) {
    con.query("SELECT SemesterID as semesterId, Season AS season, Year AS year FROM Semesters",
      function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
      });
  }
  else {
    res.redirect("/login");
  }
});

// GET semesters for specific user
app.get('/getStudentSemesters', function(req, res) {
  if (req.session && req.session.loggedIn) {
    var sql = "SELECT DISTINCT Semesters.SemesterID as semesterId, Semesters.Season AS season, Semesters.Year AS year FROM Semesters, \
    CourseOfferings, Registrations WHERE CourseOfferings.SemesterID = Semesters.SemesterID  \
    AND Registrations.OfferingID = CourseOfferings.OfferingID AND Registrations.StudentID = ?";
    con.query(sql, [req.session.userId],
      function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
      });
  }
  else {
    res.redirect("/login");
  }
});

// GET courses taken by user for specific user
app.get('/getStudentCoursesBySemester/:semesterId', function(req, res) {
  if (req.session && req.session.loggedIn) {
    var semesterId = req.params.semesterId;
      var sql = "SELECT Courses.CourseName AS name, Courses.DeptCode AS deptCode, Courses.CourseNumber AS courseNumber, \
    CourseOfferings.Professor AS prof, Courses.CreditNumber AS credits, CourseOfferings.DaysOfWeek AS days, \
    CourseOfferings.Time AS time, CourseOfferings.Building AS building, CourseOfferings.Room AS room FROM Courses, \
    CourseOfferings, Registrations WHERE CourseOfferings.SemesterID = ? AND Courses.CourseID = CourseOfferings.CourseID \
    AND Registrations.OfferingID = CourseOfferings.OfferingID AND Registrations.StudentID = ?";
    con.query(sql, [semesterId, req.session.userId],
      function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
      });
  }
  else {
    res.redirect("/login");
  }
});

app.get('/getCoursesBySemester/:semesterId', function(req, res) {
  if (req.session && req.session.loggedIn) {
    var semesterId = req.params.semesterId;
      var sql = "SELECT Courses.CourseName AS name, Courses.DeptCode AS deptCode, Courses.CourseNumber AS courseNumber, \
    CourseOfferings.Professor AS prof, Courses.CreditNumber AS credits, CourseOfferings.DaysOfWeek AS days, \
    CourseOfferings.Time AS time, CourseOfferings.Building AS building, CourseOfferings.Room AS room FROM Courses, \
    CourseOfferings Where CourseOfferings.SemesterID = ? AND Courses.CourseID = CourseOfferings.CourseID"
    con.query(sql, [semesterId],
      function(err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
      });
  }
  else {
    res.redirect("/login");
  }
});

// Logout and show Login page
app.get('/logout', function(req, res) {
  if (!req.session.loggedIn) {
    console.log("Session not started, cannot logout");
  }
  else {
    req.session.destroy();
    res.redirect("/login");
  }
});

// Send 404 message for other routes
app.get('*', function(req, res) {
  res.status(404).send("ERROR: 404 Not Found");
});