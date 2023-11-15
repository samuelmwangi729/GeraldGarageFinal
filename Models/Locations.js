const {Schema, model} = require('mongoose')

const CountySchema = new Schema({
    CountyName:{
        type:String,
        required:[true,'This County Name is required'],
    },
    status:{
        type:String,
        enum:['Active','Inactive'],
        default:'Active'
    }
},{timestamps:true})

const TownSchema = new Schema({
    County:{
        type:String,
        required:[true,'The county is required']
    },
    TownName:{
        type:String,
        required:[true,'Town Name is required']
    },
    ShippingFee:{
        type:Number,
        required:[true,'Shipping Fee is required']
    },
    status:{
        type:String,
        enum:['Active','Inactive'],
        default:'Active'
    }
},{timestamps:true})

const County = model('County',CountySchema)
const Town = model('Town',TownSchema)

module.exports = {County,Town}