// require necessary packages and modules
const express = require("express");
const { join } = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

// *** APP SETTINGS ***
// execute express app
const app = express();
// set view engine
app.set("view engine", "ejs");
// set views directory
app.set("views", join(__dirname, "views"));
