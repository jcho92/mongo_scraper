// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");
var path = require("path")
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var db = require("./models");
// Initialize Express
var app = express();
// set up a static folder 
app.use(express.static("public"))
// set up logger
app.use(logger("dev"));
// set up requests body for Json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");
// routes
require("./routes/apiRoutes")(app);




mongoose.connect("mongodb://localhost/scraperData", { useNewUrlParser: true });



// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
