const validator = require('email-validator')
const Visitors  = require('../Models/Visitors')
const User = require('../Models/Users')
const generateJwt = require('../Utils/GenerateJWTtoken')
const bcrypt = require('bcrypt')
const generateRandom = require('../Utils/RandomUID')
const EventEmitter = require('events')
const event  = new EventEmitter()
var isEmailValid=false
var isRegistered=false
event.on('isValid',(status)=>{
    if(status==='valid'){
        //update valid variable to true 
        isEmailValid=true
    }else{
        // set the variable to false
        isEmailValid=false
    }
})
event.on('Registered',(status)=>{
    if(status==='success'){
        isRegistered=true
    }else{
        isRegistered=false
    }
})
const getIpAddress = (req)=>{
    return req.headers['x-forwarded-for'] ||req.socket.remoteAddress ||null;
}
const Index = async (req,res)=>{
    var ip = getIpAddress(req)
    const userPlatform=req.headers['sec-ch-ua-platform']
    //log the visitor to the database 
    const visitor = await Visitors.create({
        VisitorIdentifier:generateRandom(15),
        VisitorIP:ip,
        Platform:userPlatform
    })
    
    res.render('Frontend/Homepage.ejs')
}

const About = (req,res)=>{
    res.render('Frontend/About.ejs')
}

const Services = (req,res)=>{
    res.render('Frontend/Services.ejs')
}

const Projects = (req,res)=>{
    res.render('Frontend/Projects.ejs')
}
const Blog = (req,res)=>{
    res.render('Frontend/Blog.ejs')
}
const Contact = (req,res)=>{
    res.render('Frontend/Contact.ejs')
}
const Subscribe = (req,res) =>{
    let message=''
    //get the data here 
    const {Email} = req.body
    verifyEmailAddress(Email)
    if(isEmailValid){
        //subscribe the user 
        message = {
            status:'success',
            data:'Valid Email',
        }
        res.status(200).json(message)
    }else{
        message = {
            status:'error',
            data:'Email is not Valid',
        }
        res.status(422).json(message)
    }
}
const verifyEmailAddress = async (emailaddress)=>{
    const isValidEmail = validator.validate(emailaddress)
    if(isValidEmail){
        event.emit('isValid','valid')
    }else{
        event.emit('isValid','invalid')
    }

}

const Register = (req,res)=>{
    res.render('Frontend/Register.ejs')
}
const Login = (req,res)=>{
    res.render('Frontend/Login.ejs')
}
const Reset = (req,res)=>{
    res.render('Frontend/Reset.ejs')
}
const GetRegDetails = async (req,res)=>{
    let message=""
    let Status=""
    let Code=""
    const {FullNames,Email,Password,ConfirmPassword} = req.body
    if(Password===ConfirmPassword){
        const userExists = await User.findOne({EmailAddress:Email})
        if(userExists){
            message="The User is Already Registered. Use Different Details"
            event.emit('Registered','error')
        }else{
            const user = new User({
                FullName:FullNames,
                EmailAddress:Email,
                Password:Password,
            })
            const salt = await bcrypt.genSalt(10)
            user.Password = await bcrypt.hash(Password,salt)
            await user.save()
            Code=200
            message="User Successfully Registered"
            event.emit('Registered','success')
        }
    }else{
        message="The passwords Does Not Match"
    }
    if(isRegistered){
        Status='success'
    }else{
        Code=422
        Status='error'
    }
    res.json({
        status:Status,
        message:message,
        code:Code
    })
}
const GetLoginDetails = async(req,res)=>{
    const {Username,Password} = req.body 
    //then check if the user exists 
    if(Username.length>0 && Password.length>0){
        //then the data is valid
        const user = await User.Login(Username,Password)
        if(user){
            const userID = await User.getUID(Username)
            //then generate the jwt token here
            const token = generateJwt(userID)
            //return the jwt token back to the browser 
            res.cookie('jwt',token,{httpOnly:true,maxAge:3*24*60*60*1000})
            //then update the visitors table using the person unique ip address
            const ip = getIpAddress(req)
            const visitor = await Visitors.findOne({VisitorIP:ip})
            //update the identifier 
            visitor.VisitorIdentifier = Username
            visitor.save()
            //after this redirect the user to the dashboard
            let data = {
                status:'success',
                message:'User Successfully Logged In',
                path:'/Dashboard',
                code:200
            }
            res.status(200).json(data)
        }else{
            let data = {
                status:'error',
                message:'Incorrect Details Entered',
                path:'/Login',
                code:403
            }
            res.status(200).json(data)
        }
    }else{
        let data = {
            status:'error',
            message:'Username and Password are both needed',
            path:'/Login',
            code:422
        }
        res.status(422).json(data)
    }
}
const Logout = (req,res)=>{
    res.cookie('jwt','',{httpOnly:true,maxAge:10})
    res.redirect('/')
}
module.exports = {Index,About,Services,Projects,Blog,Contact,Subscribe,Login,Register,Reset,GetRegDetails,GetLoginDetails,Logout}