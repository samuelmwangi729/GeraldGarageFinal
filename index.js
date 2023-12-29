const express = require('express')
const {connDb} = require('./Utils/DbConnection')
const cookieParser = require('cookie-parser')
const {getAuthUser} = require('./Middlewares/Authentication')
const homeRoutes = require('./Routes/HomeRoutes')
const ProtectedRoutes = require('./Routes/AuthRoutes')
const productRoutes = require('./Routes/ProductRoutes')
const shopRoutes = require('./Routes/ShopRoutes')
const LocationRouter = require('./Routes/LocationRoutes')
// create an express app 
const app = express()
//set the view engine 
//create a listening port 
const port = process.env.SERVER_PORT || 3000

app.listen(port,()=>{
    console.log("\n==========================================")
    console.log(`Server Started on port ${port}...`)
    console.log('Press CTRL + C to Cancel')
    connDb()
    console.log("==========================================\n")
})
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.get("*",getAuthUser)
app.set('view engine','ejs')
//set the view folder 
app.set('views','Views')
//import the home routes
app.use(homeRoutes)
app.use(shopRoutes)
app.use(productRoutes)
app.use(ProtectedRoutes)
app.use(LocationRouter)
app.use(express.static('Resources'))
//render the not found page 
app.use((req,res)=>{
    res.render('Frontend/404.ejs')
 })