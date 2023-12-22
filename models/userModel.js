const mongoose = require("mongoose");
const plm = require("passport-local-mongoose")


const userSchema = mongoose.Schema({
    image:String,
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
    
    },
    posts:[{type:mongoose.Schema.Types.ObjectId,ref:"postModel"}]
   })

userSchema.plugin(plm)

module.exports=mongoose.model("users",userSchema);