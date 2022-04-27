// require necessary packages and modules
const express = require("express");
const { join } = require("path");
const methodOverride = require("method-override");

// import todo model
const Todo = require("./models/todos");
// console.log(Todo);
// server app port number
const portNum = 3000;

// *** APP SETTINGS ***
// execute express app
const app = express();
// set view engine
app.set("view engine", "ejs");
// set views directory
app.set("views", join(__dirname, "views"));
// set static files directory
app.set(express.static(join(__dirname, "public")));

// *** MIDDLEWARE ***
// parse url-encoded [form data]
app.use(express.urlencoded({ extended: true }));
// override post req to enable certain http verb req
app.use(methodOverride("_method"));

// test request
app.get("/", (req, res) => {
    res.send("Hello World! def");
});

// *** TODOS RESTFUL ROUTES ****

// start server and listen on port
app.listen(portNum, () => {
    console.log(`listening on port: ${portNum}`);
});
