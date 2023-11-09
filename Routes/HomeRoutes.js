const {Router} = require('express')
const {Index,About,Services,Projects,Blog,Contact,Subscribe,Login,Register,Reset,GetRegDetails} = require('../Controllers/HomeController')

//create an instance 
const homeRoutes = Router()


//accept the request methods here 
homeRoutes.get("/",Index)
.get("/About",About)
.get("/Services",Services)
.get("/Projects",Projects)
.get("/Blog",Blog)
.get("/Contact",Contact)
.get("/Login",Login)
.get("/Register",Register)
.get("/Reset-Password",Reset)
.post('/Subscribe',Subscribe)
.post('/Get-Registration-Details',GetRegDetails)


module.exports = homeRoutes