const validator = require('email-validator')
const Visitors  = require('../Models/Visitors')
const User = require('../Models/Users')
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
const Index = async (req,res)=>{
    var ip = req.headers['x-forwarded-for'] ||req.socket.remoteAddress ||null;
    const userPlatform=req.headers['sec-ch-ua-platform']
    console.log(ip,userPlatform)
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
    //verify the emai; address here
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
    //get the details here 
    let message=""
    let Status=""
    let Code=""
    console.log(req.body)
    const {FullNames,Email,Password,ConfirmPassword} = req.body
    //then check if the two passwords match 
    if(Password===ConfirmPassword){
        //then the user can be stored in the database 
        //check if user exists in the database 
        const userExists = await User.findOne({EmailAddress:Email})
        if(userExists){
            console.log('user exists')
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
            console.log(user)
        }
    }else{
        //return an error message 
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
module.exports = {Index,About,Services,Projects,Blog,Contact,Subscribe,Login,Register,Reset,GetRegDetails}