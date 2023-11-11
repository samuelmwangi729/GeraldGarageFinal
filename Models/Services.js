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


const Services = model('Services',ServiceSchema)

module.exports = Services