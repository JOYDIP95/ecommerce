
const express = require('express');
const User = require("../models/User");
const Order= require("../models/order")
const Cart = require("../models/cart")
const product = require("../models/product");
var bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose')
const cryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken");
const { default: Stripe } = require('stripe');
// const JWT_SEC = "joydip"
require('dotenv')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect(
    `mongodb+srv://joydip95:joydip95@cluster0.fggdn.mongodb.net/test?retryWrites=true&w=majority`
  );



// REGISTER
app.post('/register',async(req,res)=>{
    try{
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            isAdmin: req.body.isAdmin,
            age: req.body.age
        });
        const savedUser =await newUser.save();
        if(savedUser){
            res.status(201).send("success")
        }else{
            res.status(500).send("err")
        }
    }catch(err){
        res.status(500).send(err)
    }
});

// LOGIN

app.post('/login',async(req,res)=>{
    try{
        const loggedInuser = await User.findOne({username: req.body.username, password: req.body.password})
        if(!loggedInuser){
            res.status(401).json("wrong credentials")
        }else{
            const accessToken = jwt.sign({
                id:loggedInuser._id,
                isAdmin: loggedInuser.isAdmin
             }, process.env.JWT_SEC,{expiresIn:"3d"})
            res.status(201).json({loggedInuser,accessToken})
        } 
    }catch(err){
     console.log(err)
    }  
     
})

app.listen(4000);


//VERIFICATION WITH JWT (MIDDLEWARE)



// const verifyToken = async(req,res,next)=>{
//     var authorization = req.headers.authorization
//     let decoded
//     try {
//         decoded = jwt.verify(authorization, JWT_SEC);
//         let userData = await User.findOne({
//             _id:decoded.id,
//         })
//         if(userData){
            
//             next();
//         }else{
//             res.send("User is not an admin")
//         }
//     } catch (e) {
//         return res.status(401).send('unauthorized');
//     }
//     var userId = decoded.id;
// }


// VERIFY TOKEN WITH ADMIN

const verifyTokenAndAdmin = async(req,res,next)=>{
    var authorization = req.headers.authorization
    let decoded
    try {
        decoded = jwt.verify(authorization, process.env.JWT_SEC);
        let userData = await User.findOne({
            _id:decoded.id,
            isAdmin:true
        })
        if(userData){
            
            next();
        }else{
            res.send("User is not an admin")
        }
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
    var userId = decoded.id;
}


//UPDATE USER

app.put('/update', async(req,res)=>{
    try{
        const updatedUser = await User.findByIdAndUpdate({_id:req.query.id}, {
            $set:
            {
                username:req.body.username,
                email: req.body.email,
                isAdmin: req.body.isAdmin,
                age: req.body.age,
                password: req.body.password
            }
        },{new:true});
        res.status(200).json(updatedUser)
    }
    catch(err)
    {
        res.status(500).json(err)
    }

})

// DELETE

app.delete('/delete',async(req,res)=>{
    try{
        await User.findByIdAndDelete({_id:req.query.id}) 
        res.status(200).json("User has been deleted")
    }catch(err){
        res.status(400).json("user not found")
    }
    
})

// GET USER

app.get('/get',async(req,res)=>{
    try{
        const user = await User.findById({_id:req.query.id}) 
        res.status(200).json({user})
        console.log('136',"success")
        
    }catch(err){
        res.status(400).json("user not found")
    }
    
})

// GET ALL USER

app.get('/getalluser',async(req,res)=>{
    try{
        const users = await User.find() 
        res.status(200).json({users})
        console.log('174',"success")
        
    }catch(err){
        res.status(400).json("user not found")
    }
    
})


//  CREATE PRODUCTS

app.post('/products',async(req,res)=>{
    try{
        console.log('187',req.body)
        const newProduct = new product({
            Title: req.body.Title,
            desc: req.body.desc,
            // img: req.body.img,
            categories: req.body.categories,
            size: req.body.size,
            color: req.body.color,
            price: req.body.price

        });
        const savedProduct =await newProduct.save();
        if(savedProduct){
            res.status(201).json({savedProduct})
        }else{
            res.status(500).json("err")
        }
    }catch(err){
        console.log(err)
    }
});

// PRODUCT UPDATE

app.put('/updateProduct',async(req,res)=>{
    console.log('215',req.query)
    try{
        const updateProduct = await product.findByIdAndUpdate({_id:req.query.id}, {
            $set:
            {
               Title:req.body.Title
            }
        },{new:true});
        res.status(200).json(updateProduct)
    }
    catch(err)
    {
        res.status(500).json(err)
    }

})

// GET PRODUCT

app.get('/getProduct',async(req,res)=>{
    try{
        const products = await product.findById({_id:req.query.id}) 
        res.status(200).json({products})
        console.log('238',"success")
        
    }catch(err){
        res.status(400).json("Product not found")
    }
    
})

// GET ALL PRODUCT

app.get('/getallProduct', async(req,res)=>{
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try{
        let Products;
        if(qNew){
            Products = await product.find().sort({_id: -1}).limit(3)
            console.log("260",Products)
        }else if(qCategory){
            Products = await product.find({
                categories: {
                    $in: [qCategory],
                }
            })
        } else {
            Products = await Products.find()
        }
        res.status(200).json(Products)
    }catch(err){
        res.status(500).json(err)
    }
})

//   NEW ORDER

app.post('/order',async(req,res)=>{
    const newOrder = new Order(req.body)

    try {
      const savedOrder = await newOrder.save();
      res.status(200).json(savedOrder);
    } catch (err) {
      res.status(500).json(err);
    }
});

// ORDER UPDATE

app.put('/orderUpdate',async(req,res)=>{
    try{
        const updateOrder = await Order.findByIdAndUpdate({_id:req.query.id}, {
            $set:
            {
               status: req.body.status
            }
        },{new:true})
        res.status(200).json(updateOrder)
    }catch(err){
        sres.status(400).json("Order not yet placed")
    }
    
})

// ORDER DELETE


app.delete('/deleteOrder',verifyTokenAndAdmin,(req,res)=>{
    try{
        Order.findByIdAndDelete({_id:req.query.id})
        res.status(201).json("Order successfully deleted")
    }catch(err){
        res.status(500).json(err)
    }
})

// GET ORDER

app.get('/getOrder',async(req,res)=>{
    try{
        const getorders = await Order.findById({_id:req.query.id})
        if(getorders){
            res.status(200).json(getorders)
        }else{
            res.status(404).json("Order not found")
        }
    }catch(err){
        res.status(500).json(err)
    }
})

// GET ALL ORDER

app.get('/getallOrder',async(req,res)=>{
    try{
        const getorders = await Order.find()
        if(getorders){
            res.status(200).json(getorders)
        }else{
            res.status(404).json("Order not found")
        }
    }catch(err){
        res.status(500).json(err)
    }
})


// CREATE CART

app.post('/cart',async(req,res)=>{
    const newCart = new Cart(req.body);
    try{
        const savedCart =await newCart.save();
        if(savedCart){
            res.status(201).send("success")
        }else{
            res.status(500).send("Nothing available in cart")
        }
    }catch(err){
        res.status(500).send(err)
    }
});

// UPDATE CART

app.post('/cart',async(req,res)=>{
    const newCart = new Cart(req.body);
    try{
        const savedCart =await newCart.save();
        if(savedCart){
            res.status(201).send("success")
        }else{
            res.status(500).send("Nothing available in cart")
        }
    }catch(err){
        res.status(500).send(err)
    }
});


// PAYMENT WITH STRIPE

app.post('/payment',verifyTokenAndAdmin,async(req,res)=>{
    try{
        const payment = await Stripe.Charges.create({
            source: process.env.STRIPE_KEY,
            amount: req.body.amount,
            currency:"INR"
        })
    
        if(payment){
            res.status(201).json(payment)
        }else{
            res.status(400).json("Payment not successful")
        }

    }catch(err){
        res.status(500).json(err)
    }
})


















