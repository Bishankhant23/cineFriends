const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
    imagename:String,
    caption:String,
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
})

module.exports=mongoose.model("postModel",postSchema);