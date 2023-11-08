const express = require('express')
const homeRoutes = require('./Routes/HomeRoutes')
// create an express app 
const app = express()
//import the home routes
app.use(homeRoutes)
//create a listening port 
const port = 8080

app.listen(port,()=>{
    console.log("\n==========================================")
    console.log(`Server Started on port ${port}...`)
    console.log('Press CTRL + C to Cancel')
    console.log("==========================================\n")
})