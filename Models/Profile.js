const {Schema,model} = require('mongoose')

const ProfileSchema = new Schema({
    Email:{
        type:String,
        required:[true,'This field is required']
    },
    Title:{
        type:String,
        enum:['mr','mrs'],
        required:[true,'This field is required']
    },
    PhoneNumber:{
        type:Number,
        required:[true,'This field is required']
    },
    Age:{
        type:Number,
        required:[true,'Age is required']
    },
    Residence:{
        type:String,
        required:[true,'This field is required']
    }
},{timestamps:true})

const Profile = model('Profile',ProfileSchema)

module.exports = Profile