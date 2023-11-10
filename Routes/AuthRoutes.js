const {Router} = require('express')
const {Index,Profile,All_Products,All_Services,All_Orders,GetProfileData,Add_Service,AcceptServiceData} = require('../Controllers/AuthenticatedController')
const {getAuthUser,checkAuth} = require('../Middlewares/Authentication')
const ProtectedRoutes = Router()

ProtectedRoutes.get("/Dashboard",getAuthUser,checkAuth,Index)
.get("/All-Services",getAuthUser,checkAuth,All_Services)
.get("/All-Products",getAuthUser,checkAuth,All_Products)
.get("/All-Orders",getAuthUser,checkAuth,All_Orders)
.get("/Profile",getAuthUser,checkAuth,Profile)
.get("/Add-Service",getAuthUser,checkAuth,Add_Service)
.post("/Profile-Data",getAuthUser,checkAuth,GetProfileData)
.post("/Add-A-Service",AcceptServiceData)

module.exports = ProtectedRoutes