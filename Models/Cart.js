const {Schema,model} = require('mongoose')

const CartSchema =  new Schema({
    Email:{
        type:String,
        required:[true,'This Email field is required']
    },
    Product:{
        type:String,
        required:[true,'This ProductId field is required']
    },
    ProductPrice:{
        type:Number,
        required:[true,'This ProductPrice field is required']
    },
    ProductQty:{
        type:Number,
        required:[true,'This ProductQty field is required']
    },
    TotalPay:{
        type:Number,
        required:[true,'This TotalPay field is required']
    },
    FeaturedImage:{
        type:String,
        required:[true,'This field is required'],
        default:'Null'
    },
    Status:{
        type:String,
        enum:['CheckedOut','Active','Abandoned','Wishlist'],
        default:'Active'
    }
},{timestamps:true})

const Cart = model('Cart',CartSchema)

module.exports  = Cart