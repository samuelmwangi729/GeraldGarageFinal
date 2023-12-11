const {Router} = require('express')
const {Index,AboutUs,Service,Projects,Blog,getPasswordResetPages,getPasswords,Contact,Subscribe,getPasswordResetToken,getResetEmail,Login,Register,Reset,GetRegDetails,GetLoginDetails,Logout} = require('../Controllers/HomeController')

//create an instance 
const homeRoutes = Router()


//accept the request methods here 
homeRoutes.get("/",Index)
.get("/About",AboutUs)
.get("/Services",Service)
.get("/Projects",Projects)
.get("/Blog",Blog)
.get("/Contact",Contact)
.get("/Login",Login)
.get("/Logout",Logout)
.get("/Register",Register)
.get("/Reset-Password",Reset)
.post('/Subscribe',Subscribe)
.post('/Get-Registration-Details',GetRegDetails)
.post('/Get-Details-Login',GetLoginDetails)
.post("/get-reset-Email",getResetEmail)
.get("/Password-Reset-Token/:Token",getPasswordResetToken)
.get("/Reset",getPasswordResetPages)
.post("/Get-Passwords",getPasswords)

module.exports = homeRoutes