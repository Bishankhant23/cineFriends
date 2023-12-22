const mongoose = require("mongoose");

let listSchema = mongoose.Schema({
   name:String,
   movie_ids:Array,
   user_name:String,
   likes:{
      type:Array,
      
   }
})

module.exports = mongoose.model("addListModel",listSchema)