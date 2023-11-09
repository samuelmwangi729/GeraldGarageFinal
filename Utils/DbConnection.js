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
    const dbURL = process.env.ConnectionString
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
