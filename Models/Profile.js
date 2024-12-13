const {Schema,model} = require('mongoose')

const ProfileSchema = new Schema({
    Email:{
        type:String,
        required:[true,'This field is required']
    },
    Title:{
        type:String,
        enum:['Mr','Mrs'],
        required:[true,'This field is required'],
        default:'Mr'
    },
    PhoneNumber:{
        type:Number,
        required:[true,'This field is required']
    },
    Age:{
        type:Number,
        required:[true,'Age is required'],
        default:0
    },
    Residence:{
        type:String,
        required:[true,'This field is required'],
        default:'Null'
    },
    Address:{
        type:String,
        default:''
    },
    County:{
        type:String,
        default:''
    },
    Town:{
        type:String,
        default:''
    },
    PostalCode:{
        type:String,
        default:''
    },
},{timestamps:true})

const Profile = model('Profile',ProfileSchema)

module.exports = Profile