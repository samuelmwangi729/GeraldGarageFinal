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
    const dbURL = "mongodb+srv://bh4534727:JXAaXb3eapqaeY0V@cluster-0.f1grkj9.mongodb.net/?retryWrites=true&w=majority"
        await mongoose.connect(dbURL)
        .then(response=>{
            dbConnected.emit('Connection','success')
            console.log('connection to the database successful')
        })
}
//create a connection object 
const connDb = async ()=>{
    //use the try catch block
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
