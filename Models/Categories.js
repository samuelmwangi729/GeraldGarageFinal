const {Schema,model} = require('mongoose')
const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

mongoose.plugin(slug)

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

CategorySchema.pre('save',(req,res,next)=>{
    this.CategorySlug = this.Category.split(" ").join("-")
    next()
})
const Category = model('Category',CategorySchema)


module.exports = Category