const mongoose = require("mongoose");

const watchListSchema = mongoose.Schema({
    movie_id:String,
    userName:String

})

const watchListModel = mongoose.model("watchListModel",watchListSchema);
module.exports = watchListModel;