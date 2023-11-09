const {Router} = require('express')
const {Index,About,Services,Projects,Blog,Contact,Subscribe} = require('../Controllers/HomeController')

//create an instance 
const homeRoutes = Router()


//accept the request methods here 
homeRoutes.get("/",Index)
.get("/About",About)
.get("/Services",Services)
.get("/Projects",Projects)
.get("/Blog",Blog)
.get("/Contact",Contact)
.post('/Subscribe',Subscribe)


module.exports = homeRoutes