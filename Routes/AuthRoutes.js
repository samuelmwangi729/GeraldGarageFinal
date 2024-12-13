const {Router} = require('express')
const fileUpload = require('express-fileupload')
const {Index,Profile,
    All_Products,All_Services,All_Orders,
    GetProfileData,Add_Service,
    AcceptServiceData,Activate_Service,View_Service,BookService,Suspend_Service,Verify_Token_Posted,Delete_Service,ServiceBookings,UserIndex,Verify_Profile} = require('../Controllers/AuthenticatedController')
const {getAuthUser,checkAuth,checkAdmin} = require('../Middlewares/Authentication')
const ProtectedRoutes = Router()

ProtectedRoutes.get("/Dashboard",getAuthUser,checkAuth,UserIndex)
ProtectedRoutes.get("/Administrator",getAuthUser,checkAuth,checkAdmin,Index)
.get("/All-Services",getAuthUser,checkAuth,All_Services)
.get("/Book-A-Service/",getAuthUser,checkAuth,BookService)
.post("/Post-Appointment",checkAuth,getAuthUser,ServiceBookings)
.get("/All-Products",getAuthUser,checkAuth,All_Products)
.get("/All-Orders",getAuthUser,checkAuth,All_Orders)
.get("/Profile",getAuthUser,checkAuth,Profile)
.get("/Add-Service",getAuthUser,checkAuth,Add_Service)
.post("/Profile-Data",getAuthUser,checkAuth,GetProfileData)
.post("/Add-A-Service",fileUpload({createParentPath:true}),getAuthUser,checkAuth,AcceptServiceData)
.post("/Activate-Service",Activate_Service)
.post("/View-Service",View_Service)
.post("/Suspend-Service",Suspend_Service)
.post("/Delete-Service",Delete_Service)
.get("/Verify-Profile",getAuthUser,checkAuth,Verify_Profile)
.post("/Verification-token-post",getAuthUser,checkAuth,Verify_Token_Posted)

module.exports = ProtectedRoutes