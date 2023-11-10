const {Router} = require('express')
const {getAuthUser,checkAuth} = require('../Middlewares/Authentication')
const ProtectedRoutes = Router()

ProtectedRoutes.get("/Dashboard",getAuthUser,checkAuth,(req,res)=>{
    res.render('Backend/Index.ejs')
})

module.exports = ProtectedRoutes