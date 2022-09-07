const jwt = require("jsonwebtoken")
const JWT_SEC = "joydip"


const verifyToken = (req,res,next)=>{
    authHeader = req.headers.verifyToken
    if(authHeader){
        jwt.verify(token, JWT_SEC, (err,user)=>{
            if(err){
                res.status(403).json("Token is not valid")
            }else{
                req.user = user;  
                next();
            }
        })
    }else{
        return res.status(401).json("User not authenticated") 
    }
}