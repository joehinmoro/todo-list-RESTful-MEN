// require mongoose
const mongoose = require("mongoose");

// connect to mongoDB
mongoose
    .connect("mongodb://localhost:27017/todosDB")
    .then(() => {
        console.log("DB connection successful");
    })
    .catch((err) => {
        console.log("DB connection error:", err);
    });

// define todos schema
const todoSchema = new mongoose.Schema({
    text: String,
    isDone: {
        type: Boolean,
        default: false,
    },
    timeCreated: {
        type: Date,
        default: new Date(),
    },
    timeUpdated: {
        type: Date,
        default: null,
    },
});

// define todos model
const Todo = mongoose.model("Todo", todoSchema);

// export todos model
module.exports = Todo;

// mongoose.disconnect();
