const validator = require('email-validator')
const EventEmitter = require('events')
const event  = new EventEmitter()
var isEmailValid=false
event.on('isValid',(status)=>{
    if(status==='valid'){
        //update valid variable to true 
        isEmailValid=true
    }else{
        // set the variable to false
        isEmailValid=false
    }
})
const Index = (req,res)=>{
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
        event.emit('isValid','valid')
    }

}
module.exports = {Index,About,Services,Projects,Blog,Contact,Subscribe}