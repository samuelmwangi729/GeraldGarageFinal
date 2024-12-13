require('dotenv').config()
const token  = require('jsonwebtoken')
const User = require('../Models/Users')
const url = require('url')
//check if the user is authenticated 
const checkAuth = (req,res,next)=>{
    //check if the jwt token exists
    //if it exists, the user is authenticated, else redirect to homepage
    const tokenExists = req.cookies.jwt
    if(tokenExists){
        //verify the token 
        token.verify(tokenExists,process.env.TOKEN_SECRET_KEY,(err,decodedToken)=>{
            if(err){
                //delete the token 
                res.cookie('jwt','',{httpOnly:true,maxAge:10})
                res.redirect("/")
            }else{
                next()
            }
        })
    }
}

//get the authenticated user details here 

const getAuthUser = async (req,res,next)=>{
    const tokenExists = req.cookies.jwt
    if(tokenExists){
        //verify the token
        token.verify(tokenExists,process.env.TOKEN_SECRET_KEY,async (err,decodedToken)=>{
            if(err){
                console.log("does not exist")
                res.locals.user=null
                next()
            }else{
                const userId = decodedToken.uniqueKey
                const userData = await User.findById(userId)
                const user = {
                    FullName:userData.FullName,
                    EmailAddress:userData.EmailAddress,
                    Role:userData.Role,
                    isStaff:userData.isStaff,
                    AccountStatus:userData.AccountStatus,
                }
                res.locals.user = user
                next()
            }
        })
    }else{
        res.locals.user=null
        next()
    }
}

const checkAdmin = (req,res,next)=>{
    const tokenExists = req.cookies.jwt
    if(tokenExists){
        //verify the token
        token.verify(tokenExists,process.env.TOKEN_SECRET_KEY,async (err,decodedToken)=>{
            if(err){
                res.redirect("/")
            }else{
                const userId = decodedToken.uniqueKey
                const userData = await User.findById(userId)
                if(userData.Role==='Admin' && userData.isStaff ==='Staff'){
                    next()
                }else{
                    //if logged in and not admin, goto dashboadr
                    res.redirect("/Dashboard")
                }
            }
        })
    }else{
        //back to homepage
        res.redirect("/")
    }
}
module.exports = {checkAuth,getAuthUser,checkAdmin}