require('dotenv').config();
const mongoose = require('mongoose')
const EventEmitter = require('events')
const dbConnected = new EventEmitter()

var isConnected=false
dbConnected.on('Connection',(conStatus)=>{
    if(conStatus==='success'){
        isConnected=true
    }else{
        isConnected=false
    }
})
const ConnectToDB = async ()=>{
    let dbURL=""
    if(process.env.ENVIRONMENT==='dev'){
        dbURL = process.env.ConnectionStringDev
    }else{
        dbURL = process.env.ConnectionStringProduction
    }
        await mongoose.connect(dbURL)
        .then(response=>{
            dbConnected.emit('Connection','success')
            console.log('connection to the database successful')
        })
}
const connDb = async ()=>{
    try{
        if(!isConnected){
            ConnectToDB()
        }
    }catch(e){
        dbConnected.emit('Connection','unsuccess')
        console.log('Connection to the database was Unsuccessful, retrying now....')
    }
}
module.exports=connDb
