
const mongoose = require('mongoose');

const { append } = require('express/lib/response');

const cartSchema = new mongoose.Schema({
    userId:{
        type: String,
        required : true,
        
    },
    products:[
        {
            productId:{
                type:String,
                required:true
            },
            quantity:{
                type:Number,
                default: 1
            }
        }
    ],
});

module.exports = mongoose.model("cart",cartSchema)
 