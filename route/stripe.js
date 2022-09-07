const router = require('express').router();
const stripe = require("stripe").Stripe(process.env.STRIPE_KEY);
const Auth = require('../route/auth');

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


module.exports = router();