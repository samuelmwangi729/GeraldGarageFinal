const {Schema,model} = require('mongoose')

const tokenSchema = new Schema({
    tokenValue:{
        type:String,
        required:[true,'The token is required'],
    },
    tokenType:{
        type:String,
        required:[true,'The type is required'],
        enum:['Reset','Verification'],
    },
    userEmail:{
        type:String,
        required:[true,'The user is required'],
    },
    tokenStatus:{
        type:String,
        enum:['Used','Not Used'],
        default:'Not Used'
    },
},{timestamps:true})

const Tokens = model('Tokens',tokenSchema)


module.exports = Tokens