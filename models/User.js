
const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required : true
    },

    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },

    isAdmin:{
        type:Boolean,
        default:false
    },
    age:{
        type:Number,
        required:true
    },
  
});

module.exports = mongoose.model("User",userSchema)


