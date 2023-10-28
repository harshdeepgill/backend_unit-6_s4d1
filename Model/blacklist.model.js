const mongoose = require("mongoose");


const blacklistSchema = mongoose.Schema({
    token: String
}, 
{
    versionKey: false
})

const BlacklistModel = mongoose.model("blacklist", blacklistSchema);

module.exports = {BlacklistModel};