const mongoose = require("mongoose");

const connection = mongoose.connect("mongodb+srv://harshdeepgill:1qw23er45ty6@cluster0.qbme72k.mongodb.net/unit_6_fullstack?retryWrites=true&w=majority");


module.exports = {connection}