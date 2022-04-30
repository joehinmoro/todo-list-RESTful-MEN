// require necessary packages and modules
const express = require("express");
const { join } = require("path");
const methodOverride = require("method-override");

// import todo model
const Todo = require("./models/todos");
const { findById } = require("./models/todos");
const { redirect } = require("express/lib/response");
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
    try {
        res.redirect("/todos");
    } catch (error) {
        console.log(error);
        res.send(`something went wrong<br><a href="/">home</a>`);
    }
});
app.post("/", (req, res) => {
    try {
        res.redirect("/todos");
    } catch (error) {
        console.log(error);
        res.send(`something went wrong<br><a href="/">home</a>`);
    }
});

// *** TODOS RESTFUL ROUTES ****
// index route
app.get("/todos", async (req, res) => {
    try {
        // query all todos from todos model collection
        const allTodos = await Todo.find({}).select("text isDone"); //!!!exclude unused fields. ref model collection
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

app.put("/todos/:id", async (req, res) => {
    try {
        // destruct id from req params
        const { id } = req.params;
        //   query todo document from model collection and destruct _id and isDone fields
        const { _id, isDone } = await Todo.findById(id).select("isDone");
        // console.log(_id, isDone);
        // destruct done status and location query from req query
        const { done, location } = req.query;
        // console.log("done is", done);
        // verify if todo document exists
        if (_id) {
            // verify if request is for updating done status
            if (done) {
                // update done status (isDone)
                await Todo.findByIdAndUpdate(
                    _id,
                    { isDone: !isDone },
                    { runValidators: true, new: true }
                );
                // redirect to location where req was made
                if (location === "show") {
                    res.redirect(`/todos/${_id}`);
                } else if (location === "index") {
                    res.redirect(`/todos`);
                } else {
                    // log error and render 404 !!!view
                    console.log(error);
                    res.send(`something went wrong<br><a href="/">home</a>`);
                }
            } else {
                // update todo text with data from req body
                await Todo.findByIdAndUpdate(
                    _id,
                    { text: req.body.text, timeUpdated: new Date() },
                    { runValidators: true, new: true }
                );
                // redirect to show
                res.redirect(`/todos/${_id}`);
            }
        } else {
            // log error and render 404 !!!view
            console.log(error);
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
