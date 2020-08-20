// Include the needed modules and create express application
var express = require("express");

var app = express();

var bodyParser = require("body-parser");
var session = require("express-session");

// apply the body-parser middleware to all incoming requests
app.use(bodyParser());

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

let db = require("./server/db.js");

db.initializeDatabase(function (error) {
  if (error) {
    console.error(error);
  }

  // Import routers
  let usersRouter = require("./server/users.js");
  app.use("/users", usersRouter);

  let coursesRouter = require("./server/courses.js");
  app.use("/courses", coursesRouter);

  let offeringsRouter = require("./server/offerings.js");
  app.use("/offerings", offeringsRouter);

  let registrationsRouter = require("./server/registrations.js");
  app.use("/registrations", registrationsRouter);

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
});
