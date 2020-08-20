// Router for handling users
const express = require("express");
const usersRouter = express.Router();

var crypto = require("crypto");
var db = require("./db.js")
let dbConnection = db.dbConnection;

// Login page routes 

// POST method to validate user login
// Upon successful login, user session is created
usersRouter.post("/validateLogin", function (req, res) {
    // Find username and hashed password
    var username = req.body.username;
    var pwd = req.body.password;
    var hashed_pwd = crypto.createHash("sha256").update(pwd).digest("base64");
    var sql = "SELECT * FROM Users WHERE UserLogin = ? AND UserPassword = ?";
    // Determine if corresponding entry exists in Users table
    dbConnection.query(sql, [username, hashed_pwd], function (err, result, fields) {
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
  usersRouter.get("/isAdmin", function (req, res) {
    if (req.session.isAdmin) {
      res.json({ isAdmin: true });
    } else {
      res.json({ isAdmin: false });
    }
  });
  
  // GET method used by login.html to determine if error message should be displayed
  // Sends the value of the session variable flag to show login status
  usersRouter.get("/loginStatus", function (req, res) {
    if (req.session.flag == 0 || req.session.flag == 1) {
      res.json({ flag: req.session.flag });
    } else {
      var flagNotSet = -1;
      res.json({ flag: flagNotSet });
    }
  });
  
// Admin page routes 

// GET all users from Users table
usersRouter.get("/", function (req, res) {
    if (req.session && req.session.loggedIn) {
      dbConnection.query(
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

// POST method to edit user on Admin page
usersRouter.post("/editUser", function (req, res) {
  var loginSql = "SELECT * FROM Users WHERE UserLogin = ? AND UserID <> ?";
  dbConnection.query(loginSql, [req.body.login, parseInt(req.body.userId)], function (
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
      dbConnection.query(sql, args, function (err, result, fields) {
        // Send that it worked
        res.json({ isLoginTaken: false });
      });
    }
  });
});

// POST method to add user on Admin page
usersRouter.post("/addUser", function (req, res) {
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
  dbConnection.query(loginSql, [req.body.login], function (err, result, fields) {
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
      dbConnection.query(sql, args, function (err, result, fields) {
        if (err) throw err;
        res.json({ isLoginTaken: false });
      });
    }
  });
});

// POST method to delete user on Admin page
usersRouter.post("/deleteUser", function (req, res) {
  // Delete the user with the specified ID
  if (req.session.userId != req.body.id) {
    var sql = "DELETE FROM Users WHERE UserID = ?";
    var args = [req.body.id];
    dbConnection.query(sql, args, function (err, result, fields) {
      res.json({ isDeleted: true });
    });
  }
  // Error if trying to delete currently logged in user
  else {
    res.json({ isDeleted: false });
  }
});

// Use in index.js

module.exports = usersRouter;