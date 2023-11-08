const express = require('express')
const homeRoutes = require('./Routes/HomeRoutes')
// create an express app 
const app = express()
//set the view engine 
//create a listening port 
const port = 8080

app.listen(port,()=>{
    console.log("\n==========================================")
    console.log(`Server Started on port ${port}...`)
    console.log('Press CTRL + C to Cancel')
    console.log("==========================================\n")
})
app.set('view engine','ejs')
//set the view folder 
app.set('views','Views')
//import the home routes
app.use(homeRoutes)
app.use(express.static('Resources'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use((req,res)=>{
    res.redirect("/")
 })