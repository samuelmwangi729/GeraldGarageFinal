const url = require('url')
const {County,Town} = require('../Models/Locations')
const Products = require('../Models/Products')
const Cart = require('../Models/Cart')
const Shipping = require('../Models/Shipping')
const InitiatePay = require('../Utils/Payments')
const InitPay = require('../Models/InitializedPayments')
const generateRandom = require('../Utils/RandomUID')
const Profile = require('../Models/Profile')
const Payments = require('../Models/Payments')
const Order = require('../Models/Orders')
const Pay = async (req,res)=>{
    const OrderId = generateRandom(8)
    const email = res.locals.user.EmailAddress
    let cart = await Cart.find({Email:email,Status:'Active'})
    if(cart.length<=0){
        res.status(422).json({
            status:'error',
            message:`Shopping Cart Cant be Empty`,
            code:422
        })
    }else{
        let sum =0;
        for(let i=0;i<cart.length;i++){
            sum=sum+cart[i].TotalPay
            cart[i].OrderId = OrderId
            await cart[i].save()
        }
        const profile = await Profile.findOne({Email:email})
        const profileCounty = profile.County
        const profileTown = profile.Town
        //get the locations from the locations models
        const locations = await Town.findOne({County:profileCounty,TownName:profileTown})
        let totalPay= sum + locations.ShippingFee
        const initLog = await InitPay.create({
            InitStatus:"Success",
            Message:"Done",
            AuthUrl:"dhhjd",
            AccessCode:"zxzxc",
            PaymentRef:"xcxcvx",
            PaymentReason:`Payment for Goods Plus Delivery for order ${OrderId}`,
            UserEmail:email,
            OurRef:OrderId,
            PaymentType:'CheckOut',
            AmountPaid:totalPay,
        })
        res.json(initLog)
        // InitiatePay(res,OrderId,'CheckOut',`Payment for Goods Plus Delivery for order ${OrderId}`,10,email)
    }
}
const Checkout = async(req, res)=>{
    const email = res.locals.user.EmailAddress
    const profile = await Profile.findOne({Email:email})
    let cart = await Cart.find({Email:email,Status:'Active'})
    let sum =0;
    for(let i=0;i<cart.length;i++){
        sum=sum+cart[i].TotalPay
    }
    const counties = await County.find({status:'Active'})
    res.render('Backend/Products/Checkout.ejs',{cart:cart,totalPrice:sum,counties:counties,profile:profile})
}
const Save_CheckOut_Details = async(req,res)=>{
    const {phoneNumber,emailAddress,county,town,residence,postalCode} = req.body
    const userEmail = res.locals.user.EmailAddress
    const profile = await Profile.findOne({Email:userEmail})
    if(profile){
        profile.Email=userEmail,
        profile.PhoneNumber=phoneNumber,
        profile.Address=residence,
        profile.County=county,
        profile.Town=town.split(",")[0],
        profile.PostalCode=postalCode,
        await profile.save()
    }else{
        //create the profile
        const profile = new Profile({
            Email:userEmail,
            PhoneNumber:phoneNumber,
            Address:residence,
            County:county,
            Town:town,
            PostalCode:postalCode,
        })
        await profile.save()
    }
    res.status(200).json({
        status:'success',
        message:`Shipping details Saved`,
        code:200
    })
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
const getCallBackData = async(req,res)=>{
    const data = req.body
    const stats = data.data
    let paymentStatus = stats.status //Our reference in the payment Initialized
    let paymentref = stats.reference
    let paymentAmount = stats.amount / 100
    let paymentChannel = stats.channel
    let paymentCurrency = stats.currency
    let ipAddress = stats.ip_address
    let cardBin = stats.authorization.bin
    let cardLastFour = stats.authorization.last4
    let cardExpMonth =stats.authorization.exp_month
    let cardExpYear =stats.authorization.exp_year
    let cardType =stats.authorization.card_type
    let cardBank =stats.authorization.bank
    let cardCountry =stats.authorization.country_code
    let cardBrand =stats.authorization.brand
    let customerEmail = stats.customer.email
    let paidAt =  data.data.paidAt
    //update the payments table
    //check if payment exists in the db  
    const pExists = await Payments.findOne({paymentref:paymentref})
    if(pExists){
        res.json({
            message:'Unknown Error Occurred'
        })
    }else{
        const payment = await Payments.create({
            paymentStatus:paymentStatus,
            paymentref:paymentref,
            paymentAmount:paymentAmount,
            paymentChannel:paymentChannel,
            paymentCurrency:paymentCurrency,
            ipAddress:ipAddress,
            cardBin:cardBin,
            cardLastFour:cardLastFour,
            cardExpMonth:cardExpMonth,
            cardExpYear:cardExpYear,
            cardType:cardType,
            cardBank:cardBank,
            cardCountry:cardCountry,
            cardBrand:cardBrand,
            customerEmail:customerEmail,
            paidAt:paidAt,
        })
        //check if the amount paid is the required amount
        const initializedPayment = await InitPay.findOne({OurRef:paymentref})
        //add the shipping amount 
        if(initializedPayment.AmountPaid<=payment.paymentAmount){
            //update the cart to as checked out 
            let cart = await Cart.find({OrderId:paymentref,Status:'Active'})
            let sum =0;
            let orderOwner = ""
            for(let i=0;i<cart.length;i++){
                cart[i].Status = 'CheckedOut'
                if(orderOwner){

                }else{
                    orderOwner = cart[i].Email
                }
                await cart[i].save()
            }
            payment.Status='Used'
            payment.save()
            //place the order now
            const order = new Order({
                OrderId:paymentref,
                Client:orderOwner,
                OrderAmount:payment.paymentAmount,
            })
            await order.save()
            if(order){
                res.json({
                    message:'Order Successfully Placed'
                })
            }
        }else{
            console.log("Insufficient amount paid")
            res.json({
                message:`The amount paid is not the required amount. Please top up ${initializedPayment.AmountPaid-payment.paymentAmount}`
            })
        }
    }
}
const WorkOnOrders = async (req,res)=>{
    const {ID,ACTION} = req.body
    //get the orders of the logged in user
    const userEmail  = res.locals.user.EmailAddress
    //get the order for the user 
    let order = await Order.findOne({Client:userEmail,OrderId:ID})
    if(order.OrderStatus==='Shipped'){
        res.status(400).json({
            status:'error',
            message:'Order is Already In Transit',
            code:400
        })
    }else{
        if(ACTION==='Cancel'){
            order.OrderStatus="Cancelled"
            await order.save()
            res.status(200).json({
                status:'success',
                message:'Order Successfully Cancelled',
                code:200
            })
        }else if(ACTION==='Ship'){
            order.OrderStatus="Shipped"
            await order.save()
            res.status(200).json({
                status:'success',
                message:'Order Successfully Shipped',
                code:200
            })
        }else if(ACTION==='Reorder'){
            order.OrderStatus="Active"
            await order.save()
            res.status(200).json({
                status:'success',
                message:'Products Successfully Reordered',
                code:200
            })
        }else{
            res.status(400).json({
                status:'error',
                message:'Unknown Error Occurred',
                code:400
            }) 
        }
    }
    //check the action 
}
const getPayments = async (req,res)=>{
    const payments = await Payments.find({Status:'Used'})
    let sum=0
    for(let i=0;i<payments.length;i++){
        sum = sum+parseInt(payments[i].paymentAmount)
    }
    res.render("Backend/Products/All-Payments.ejs",{payments,sum})
}
module.exports = {CartIndex,getPayments,Remove_From_Cart,AddCart,Checkout,Pay,Save_CheckOut_Details,WorkOnOrders,Locations,Pay,getCallBackData}