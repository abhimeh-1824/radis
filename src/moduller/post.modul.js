const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    }
},{
    timestamps:true,
    versionKey:false
})

module.exports  = mongoose.model("post",postSchema)