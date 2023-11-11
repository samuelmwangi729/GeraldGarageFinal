const express = require('express')
const connDb = require('./Utils/DbConnection')
const cookieParser = require('cookie-parser')
const homeRoutes = require('./Routes/HomeRoutes')
const ProtectedRoutes = require('./Routes/AuthRoutes')
// create an express app 
const app = express()
//set the view engine 
//create a listening port 
const port = 8080

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
app.set('view engine','ejs')
//set the view folder 
app.set('views','Views')
//import the home routes
app.use(homeRoutes)
app.use(ProtectedRoutes)
app.use(express.static('Resources'))
//render the not found page 
app.use((req,res)=>{
    res.render('Frontend/404.ejs')
 })