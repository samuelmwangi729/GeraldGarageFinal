const {Schema,model} = require('mongoose')

const CategorySchema = new Schema({
    Category:{
        type:String,
        required:[true,'Category Title is required']
    },
    CategorySlug:{
        type:String,
        slug:'Category'
    },
    Status:{
        type:String,
        enum:['Active','Inactive'],
        default:'Active'
    }
},{timestamps:true})

const Category = model('Category',CategorySchema)


module.exports = Category