const {Schema,model } = require('mongoose')

const ContactSchema = new Schema({
    Address:{
        type:String,
        required:[true,'This field is required']
    },
    Emails:{
        type:String,
        required:[true,'This field is required']
    },
    PhoneNumbers:{
        type:String,
        required:[true,'This field is required']
    },
},{timestamps:true})

const Contact = model('Contact',ContactSchema)


module.exports = Contact