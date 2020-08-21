// Create database connection

var mysql = require("mysql");
var fs = require("fs");
var xml2js = require("xml2js");

module.exports.initializeDatabase = function (callback) {
  // Set up parser to parse xml
  var parser = new xml2js.Parser();
  var dbInfo;
  var connection;

  // Create the database connection using the parser
  fs.readFile(__dirname + "/dbConfig.xml", function (err, data) {
    if (err) throw err;
    parser.parseString(data, function (err, result) {
      if (err) throw err;
      dbInfo = result;
      //Establish database connection
      connection = mysql.createConnection({
        host: dbInfo.dbConfig.host[0],
        user: dbInfo.dbConfig.user[0],
        password: dbInfo.dbConfig.password[0],
        database: dbInfo.dbConfig.database[0],
        port: dbInfo.dbConfig.port[0],
      });
      connection.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
        module.exports.dbConnection = connection;
        callback(err);
      });
    });
  });
};
