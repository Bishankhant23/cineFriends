const mongoose = require("mongoose");

const catSchema = mongoose.Schema({
    "name":String
})

module.exports=mongoose.model("catModel",catSchema)