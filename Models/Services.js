const {Schema,model} =  require('mongoose')

//create the services schema 

const ServiceSchema =  new Schema({
    Title:{
        type:String,
        required:[true,'This field is required'],
    },
    Pay:{
        type:Number,
        required:[true,'This field is required'],
        default:0
    },
    Headline:{
        type:String,
        required:[true,'This field is required'],
    },
    Description:{
        type:String,
        required:[true,'This field is required'],
    },
    Photo:{
        type:String,
        required:[true,'This field is required'],
        default:'none.png'
    },
    Status:{
        type:String,
        enum:['Active','Inactive'],
        default:'Active'
    }
},{timestamps:true})

const OrderServiceSchema = new Schema({
    ServiceID:{
        type:String,
        required:[true,'Service ID is required']
    },
    ServiceTitle:{
        type:String,
        required:[true,'Service title is required']
    },
    Client:{
        type:String,
        required:[true, 'the user is required']
    },
    ServiceDate:{
        type:Date,
        required:[true,'The Date is required']
    },
    Amount:{
        type:Number,
        required:[true,'The amount is required']
    },
    Status:{
        type:String,
        enum:['Active','Cancelled','Completed'],
        default:'Active'
    },
    PaymentStatus:{
        type:String,
        enum:['Paid','Pending'],
        default:'Pending'
    }
},{timestamps:true})
const Services = model('Services',ServiceSchema)
const ServiceBooking = model('ServiceBooking',OrderServiceSchema)
module.exports = {Services,ServiceBooking}