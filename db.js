const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

var env = process.env.NODE_ENV || "development";
if (env === "development") {
  var config = require("./config")["development"];
} else if (env.trim() == "prod") {
  var config = require("./config")["production"];
} else if (env.trim() == "colo") {
  var config = require("./config")["colo"];
}else if (env.trim() == "gcp") {
  var config = require("./config")["gcp"];
} else {
  var config = require("./config")["uat"];
}

const {
    database: { host, port, name, suffix },
  } = config;

//const connectionString = `mongodb://${host}:${port}/${name}${suffix}`;
//mongoose.connect(connectionString, { useNewUrlParser: true });
//var db = mongoose.connection;

//module.exports = db
