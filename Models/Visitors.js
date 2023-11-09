const {Schema, model} = require('mongoose')

const VisitorSchema = new Schema({
    VisitorIdentifier:{
        type:String,
        required:[true,'This field is required']
    },
    VisitorIP:{
        type:String,
        required:[true,'This field is required']
    },
    Platform:{
        type:String,
        required:[true,'This field is required']
    },
},{timestamp:true})


const Visitors = model('Visitor',VisitorSchema)

module.exports =  Visitors