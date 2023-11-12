const {Schema,model} = require('mongoose')

const VariationSchema = new Schema({
    Category:{
        type:String,
        required:[true,'The Variation field is required'],
    },
    Variation:{
        type:Array,
        required:[true,'The Variation is required'],
    },
    Status:{
        type:String,
        enum:['Active','Inactive'],
        default:'Active'
    }
},{timestamps:true})

const Variation = model('Variation',VariationSchema)

module.exports = Variation