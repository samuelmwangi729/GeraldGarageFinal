const {Schema,model} = require('mongoose')

const OrderSchema = new Schema({
    OrderId:{
        type:String,
        required:[true,'Order Id is required']
    },
    Client:{
        type:String,
        required:[true,'The owner of the Order is required']
    },
    OrderAmount:{
        type:Number,
        required:[true,'The order amount is required']
    },
    OrderStatus:{
        type:String,
        enum:['Active','Shipped','Cancelled'],
        default:'Active'
    }
},{timestamps:true})

const Order = model('Order',OrderSchema)

module.exports = Order