const {Router} = require('express')
const {Index} = require('../Controllers/HomeController')

//create an instance 
const homeRoutes = Router()


//accept the request methods here 
homeRoutes.get("/",Index)


module.exports = homeRoutes