const {Router} = require('express')
const {Index,AboutUs,Services,Projects,Blog,Contact,Subscribe,Login,Register,Reset,GetRegDetails,GetLoginDetails,Logout} = require('../Controllers/HomeController')

//create an instance 
const homeRoutes = Router()


//accept the request methods here 
homeRoutes.get("/",Index)
.get("/About",AboutUs)
.get("/Services",Services)
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


module.exports = homeRoutes