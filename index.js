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

// *** MIDDLEWARE ***
// set static files directory
app.use(express.static(join(__dirname, "public")));
// parse url-encoded [form data]
app.use(express.urlencoded({ extended: true }));
// override post req to enable certain http verb req
app.use(methodOverride("_method"));

// root routes (redirect to todos/)
app.get("/", (req, res) => {
    res.redirect("/todos");
});
app.post("/", (req, res) => {
    res.redirect("/todos");
});

// *** TODOS RESTFUL ROUTES ****
// index route
app.get("/todos", async (req, res) => {
    try {
        // query all todos from todos model collection
        const allTodos = await Todo.find({}); //!!!exclude unused fields. ref model collection
        // console.log(allTodos);
        res.render("todos/index", { title: "All Todos", allTodos });
    } catch (error) {
        // log error and render 404 !!!view
        console.log(error);
        res.send(`something went wrong<br><a href="/">home</a>`);
    }
});

// new route
app.get("/todos/new", (req, res) => {
    try {
        // render the new todo view
        res.render("todos/new", { title: "New Todo" });
    } catch (error) {
        // log error and render 404 !!!view
        console.log(error);
        res.send(`something went wrong<br><a href="/">home</a>`);
    }
});

// create route
app.post("/todos", async (req, res) => {
    try {
        // destruct new todo text from req body
        const { text } = req.body;
        // create new todo model instance
        const todo = new Todo({ text });
        // insert new todo into todos model collection
        await todo.save();
        // redirect after inserting
        res.redirect("/todos");
    } catch (error) {
        // log error and render 404 !!!view
        console.log(error);
        res.send(`something went wrong<br><a href="/">home</a>`);
    }
});

// show route
app.get("/todos/:id", async (req, res) => {
    try {
        // destruct id from url
        const { id } = req.params;
        // query todo document by id
        const todo = await Todo.findById(id);
        if (todo) {
            console.log(todo);
            // render show view if _id is valid
            res.render("todos/show", { title: todo.text, todo });
        } else {
            // render 404 page if _id is invalid
            res.send(`something went wrong<br><a href="/">home</a>`);
        }
    } catch (error) {
        // log error and render 404 !!!view
        console.log(error);
        res.send(`something went wrong<br><a href="/">home</a>`);
    }
});

// edit route
app.get("/todos/:id/edit", async (req, res) => {
    try {
        // destruct id from url
        const { id } = req.params;
        // query for todo document using id
        const todo = await Todo.findById(id);
        if (todo) {
            // render show view if _id is valid
            res.render("todos/edit", { title: todo.text, todo });
        } else {
            // render 404 page if _id is invalid
            res.send(`something went wrong<br><a href="/">home</a>`);
        }
    } catch (error) {
        // log error and render 404 !!!view
        console.log(error);
        res.send(`something went wrong<br><a href="/">home</a>`);
    }
});

// start server and listen on port
app.listen(portNum, () => {
    console.log(`listening on port: ${portNum}`);
});
