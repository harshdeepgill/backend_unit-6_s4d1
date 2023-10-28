const mongoose = require("mongoose");


const todoSchema = mongoose.Schema({
    title: String,
    status: Boolean,
    userId: String
},
{
    versionKey: false
})


const TodoModel = mongoose.model("todo", todoSchema);

module.exports = {TodoModel}