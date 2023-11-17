const {Router} = require('express')
const {CartIndex,AddCart,Remove_From_Cart,Checkout,Locations,Save_CheckOut_Details,Pay,getCallBackData} = require('../Controllers/ShopController')
const {getAuthUser} = require('../Middlewares/Authentication')
const shopRoutes = Router()
shopRoutes.post("/Add-To-Cart",getAuthUser,AddCart)
shopRoutes.get("/Cart",getAuthUser,CartIndex)
shopRoutes.get("/Checkout",getAuthUser,Checkout)
shopRoutes.get("/Locations",getAuthUser,Locations)
shopRoutes.post("/Remove-Cart-Item",getAuthUser,Remove_From_Cart)
.post("/Save-Checkout-Details",getAuthUser,Save_CheckOut_Details)
.get("/Pay",getAuthUser,Pay)
.post("/CallBack",getCallBackData)

module.exports = shopRoutes