const url = require('url')
const {County,Town} = require('../Models/Locations')
const Products = require('../Models/Products')
const Cart = require('../Models/Cart')
const Shipping = require('../Models/Shipping')
const InitiatePay = require('../Utils/Payments')
const generateRandom = require('../Utils/RandomUID')
const Pay = async (req,res)=>{
    const OrderId = generateRandom(8)
    const email = res.locals.user.EmailAddress
    let cart = await Cart.find({Email:email,Status:'Active'})
    let sum =0;
    for(let i=0;i<cart.length;i++){
        sum=sum+cart[i].TotalPay
        cart[i].OrderId = OrderId
        await cart[i].save()
    }
    const shipping = await Shipping.findOne({Email:email})
    const shippingFees = shipping.Fees
    let totalPay= sum + shippingFees
    InitiatePay(res,OrderId,'CheckOut','Payment for Goods Plus Delivery',totalPay,email)
}
const Checkout = async(req, res)=>{
    const email = res.locals.user.EmailAddress
    let cart = await Cart.find({Email:email,Status:'Active'})
    let sum =0;
    for(let i=0;i<cart.length;i++){
        sum=sum+cart[i].TotalPay
    }
    console.log("check out")
    res.render('Backend/Products/Checkout.ejs',{cart:cart,totalPrice:sum})
}
const CartIndex = async (req,res)=>{
    const email = res.locals.user.EmailAddress
    let cart = await Cart.find({Email:email,Status:'Active'})
    res.render('Backend/Products/Cart.ejs',{cart})
}
const Remove_From_Cart = async (req,res)=>{
    const email = res.locals.user.EmailAddress
    const {ItemID} = req.body
    const cart = await Cart.findById(ItemID)
    if(cart){
        await Cart.findByIdAndDelete(ItemID)
        res.status(200).json({
            status:'success',
            message:`Product Successfully Removed from Cart.Refreshing ...`,
            code:200
        })
        
    }else{
        res.status(422).json({
            status:'error',
            message:`Could Not remove the item from Cart`,
            code:422
        })
    }
}
const AddCart = async(req,res) =>{
    const userEmail = res.locals.user.EmailAddress
    const {productName,action} = req.body
    const product = await Products.findOne({ProductName:productName,Status:'Active'})
    const totalPay = product?.Price * 1 
    var cartStatus = null;
    if(action==='Cart'){
        cartStatus = 'Active'
    }else{
        cartStatus='Wishlist'
    }
    if(product){
        const existingCart = await Cart.findOne({Email:userEmail,Product:product.ProductName,Status:cartStatus})
        if(existingCart){
            if(cartStatus==='Wishlist'){
                res.status(422).json({
                    status:'error',
                    message:`Product Already Added to Wishlist`,
                    code:422
                })
            }else{
                let Qty = existingCart.ProductQty
                let TotalPay = existingCart.totalPay
                //update Qty 
                Qty = Qty+1
                TotalPay = existingCart.ProductPrice * Qty
                existingCart.ProductQty = Qty
                existingCart.TotalPay = TotalPay
                await existingCart.save()
                res.status(200).json({
                    status:'success',
                    message:`${product.ProductName} Updated In Cart`,
                    code:200
                })
            }
        }else{
            const ifInWishlist = await Cart.findOne({Email:userEmail,Product:product.ProductName,Status:'Wishlist'})
            if(ifInWishlist){
                ifInWishlist.Status=cartStatus
                await ifInWishlist.save()
                res.status(200).json({
                    status:'success',
                    message:`${product.ProductName} Moved from Wishlist to Cart`,
                    code:200
                })
            }else{
                //check if the product is in wishlist 
                const ifInCart = await Cart.findOne({Email:userEmail,Product:product.ProductName,Status:'Active'})
                if(ifInCart && cartStatus==='Wishlist' ){
                    res.status(422).json({
                        status:'error',
                        message:`Product Can't be moved from Cart to Wishlist`,
                        code:422
                    })
                }else{
                    const cart = new Cart({
                        Email:userEmail,
                        Product:product.ProductName,
                        ProductPrice:product.Price,
                        ProductQty:1,
                        TotalPay:totalPay,
                        Status: cartStatus,
                        FeaturedImage:product.ProductImage
                    })
                    await cart.save()
                    if(cart){
                        res.status(200).json({
                            status:'success',
                            message:`${product.ProductName} Added to ${action==='Cart'?'Cart':'Wishlist'}`,
                            code:200
                        })
                    }else{
                        res.status(422).json({
                            status:'error',
                            message:`Product Could not be Added to cart`,
                            code:422
                        })
                    }
                }

            }
        }
    }

}
const Locations = async(req,res)=>{
    const county = await County.find()
    const towns = await Town.find()
    res.render('Backend/Locations/Add.ejs',{counties:county,towns:towns})
}
module.exports = {CartIndex,Remove_From_Cart,AddCart,Checkout,Pay,Locations}