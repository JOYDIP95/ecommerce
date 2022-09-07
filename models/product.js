
const mongoose = require('mongoose');
const { append } = require('express/lib/response');
const productSchema = new mongoose.Schema({
    Title:{
        type: String,
        required : true,
       
    },

    desc:{
        type:String,
        required:true,
       
    },
    // img:{
    //     type:String,
    //     required:true
    // },

    categories:{
        type:Array,
        required:true
    },
   
    size:{
        type:Number,
        required:true
    },
    color:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }

    
});

module.exports = mongoose.model("product",productSchema)
 