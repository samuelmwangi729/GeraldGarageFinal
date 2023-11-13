const {Schema,model} = require('mongoose')

const BrandSchema = new Schema({
    Brand:{
        type:String,
        required:[true,'The brand name is required']
    },
    Image:{
        type:String,
        required:[true,'The brand Image is required']
    },
    Category:{
        type:String,
        required:[true,'The category is required'],
        default:'Generic'
    },
    Status:{
        type:String,
        enum:['Active','Inactive'],
        default:'Active'
    }
},{timestamps:true})

const Brand = model('Brand',BrandSchema)

module.exports = Brand