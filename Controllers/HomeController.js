const validator = require('email-validator')
const Visitors  = require('../Models/Visitors')
const Tokens = require('../Models/Tokens')
const User = require('../Models/Users')
const generateJwt = require('../Utils/GenerateJWTtoken')
const bcrypt = require('bcrypt')
const generateRandom = require('../Utils/RandomUID')
const {Services} = require('../Models/Services')
const {About} = require('../Models/About')
const {checkAdmin} = require('../Middlewares/Authentication')
const sendEmail = require('../Utils/MailSender')
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
    const about = await About.findOne({Status:'Active'})
    var ip = getIpAddress(req)
    const userPlatform=req.headers['sec-ch-ua-platform']
    //log the visitor to the database 
    const visitor = await Visitors.create({
        VisitorIdentifier:generateRandom(15),
        VisitorIP:ip,
        Platform:userPlatform
    })
    const services = await Services.find({Status:'Active'})
    res.render('Frontend/Homepage.ejs',{services,about})
}

const AboutUs = async (req,res)=>{
    const about = await About.findOne({Status:'Active'})
    res.render('Frontend/About.ejs',{about})
}

const Service = async (req,res)=>{
    const services = await Services.find({Status:'Active'})
    res.render('Frontend/Services.ejs',{services})
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
    if(Username && Password){
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
            let path;
            //check if user is admin or not
            const isAdmin = await User.findOne({EmailAddress:Username})
            if(isAdmin.Role==='Admin' && isAdmin.isStaff ==='Staff'){
                path='/Administrator'
            }else{
                path='/Dashboard'
            }
            //after this redirect the user to the dashboard
            let data = {
                status:'success',
                message:'User Successfully Logged In',
                path:path,
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
const getResetEmail = async (req, res)=>{
    const {EmailAddress} = req.body
    const user = await User.findOne({EmailAddress:EmailAddress})
    if(user){
        //generate the password reset token
        const resetToken = generateRandom(6)
        //check if a token exists 
        const tokenExists = await Tokens.findOne({userEmail:EmailAddress,tokenStatus:'Not Used'})
        if(tokenExists){
            tokenExists.tokenStatus='Used'
            await tokenExists.save()
        }
        const token = await Tokens.create({
            tokenValue:resetToken,
            userEmail:EmailAddress,
            tokenType:'Reset',
            tokenStatus:'Not Used'
        })
        //Send the email with the reset token 
        if(token){
            await sendEmail(EmailAddress,'Please get your attached password reset token here',resetToken,"Reset")
        }
    }

    res.status(200).json({
        status:'success',
        message:'If the Account Exists, You will receive the Email',
        code:200
    })
}
const getPasswordResetPages = async (req, res)=>{
    res.render("Frontend/Passwords.ejs",{UserEmail:res.locals.Email?res.locals.Email:""})
}
const getPasswordResetToken =  async(req,res)=>{
    const {Token} = req.params
    const token = await Tokens.findOne({
        tokenValue:Token,
        tokenType:'Reset',
        tokenStatus:'Not Used'
    })
    if(token){
        //create a cookie with the token 
        res.cookie('resetToken',Token,{httpOnly:true,maxAge:1*1*60*60*1000})
        res.redirect('/Reset')
    }else{
        res.redirect("/Reset-Password")
    }
}
const getPasswords = async(req, res)=>{
    const tokenUser = await Tokens.findOne({tokenValue:req.cookies.resetToken,tokenStatus:'Not Used'})
    if(tokenUser){
        //get the email address 
        const userEmail = tokenUser.userEmail
    }else{
        res.redirect('/')
    }
    const {Password,ConfirmPassword} = req.body
    //user email 
    const user = await User.findOne({EmailAddress:tokenUser.userEmail})
    if(user){
        if(Password===ConfirmPassword){
            const salt = await bcrypt.genSalt(10)
            user.Password = await bcrypt.hash(Password,salt)
            await user.save()
            tokenUser.tokenStatus="Used"
            await tokenUser.save()
            res.cookie('resetToken','',{httpOnly:true,maxAge:10})
            res.status(200).json({
                status:'success',
                message:'Password Successfully Reset',
                code:200
            })
        }else{
            res.status(422).json({
                status:'error',
                message:'Unknown Error Occurred',
                code:422
            })
        }
    }else{
        res.status(422).json({
            status:'error',
            message:'Account Does Not Exist. Please Contact Us for Support',
            code:422
        })
    }
}
module.exports = {Index,getPasswords,getPasswordResetPages,getPasswordResetToken,getResetEmail,AboutUs,Service,Projects,Blog,Contact,Subscribe,Login,Register,Reset,GetRegDetails,GetLoginDetails,Logout}