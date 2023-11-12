const {Schema,model} = require('mongoose')
const mongoose  = require('mongoose')
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)
const ProductSchema = new Schema({
    ProductName:{
        type:String,
        required:[true,'Product Title is required']
    },
    ProductSlug:{
        type:String,slug:'ProductName'
    },
    ProductCategory:{
        type:String,
        required:[true,'product category is required']
    },
    ProductImage:{
        type:String,
        required:[true,'The product Image is required']
    },
    ProductImages:{
        type:Array,
    },
    ProductDescription:{
        type:String,
        required:[true,'Product Description is required']
    },
    SKU:{
        type:String,
    },
    Brand:{
        type:String,
        required:[true,'The brand is required'],
        default:'Generic'
    },
    Qty:{
        type:Number,
        required:[true,'The qty is required']
    },
    Price:{
        type:Number,
        required:[true,'Price is required']
    },
    ProductVariations:{
        type:Array,
        required:[true,'Product Variations are required'],
        default:['']
    },
    Status:{
        type:String,
        enum:['Active','Inactive'],
        default:'Active'
    }
},{timestamps:true})
Products.statics.getBrand = async(brand)=>{
    //get the products with all the brands passed as arguments
    const products = await Products.find({Brand:brand})
    if(products){
        return products
    }else{
        return false
    }
}
Products.statics.getCategory = async(category)=>{
    //get the products with all the brands passed as arguments
    const products = await Products.find({ProductCategory:category})
    if(products){
        return products
    }else{
        return false
    }
}
Products.statics.findBySlug = async(slug)=>{
    //get the products with all the brands passed as arguments
    const products = await Products.findOne({ProductSlug:slug})
    if(products){
        return products
    }else{
        return false
    }
}
const Products = model('Products',ProductSchema)

module.exports = Products