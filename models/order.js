const { ObjectID } = require('bson')
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router()
var bodyParser = require('body-parser')
const { append } = require('express/lib/response');
const app = express();

const OrderSchema = new mongoose.Schema({
    userId:{
        type: String,
        required : true,
        unique:true
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
    amount:{type:Number, required:true},
    address:{type:Object, required:true},
    status:{type:String, default:"pending"}
}); 

module.exports = mongoose.model("Order",OrderSchema)
 