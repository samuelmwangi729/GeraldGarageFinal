const {Router} = require('express')
const {CartIndex,AddCart,Remove_From_Cart,Checkout,Locations} = require('../Controllers/ShopController')
const {getAuthUser} = require('../Middlewares/Authentication')
const shopRoutes = Router()
shopRoutes.post("/Add-To-Cart",getAuthUser,AddCart)
shopRoutes.get("/Cart",getAuthUser,CartIndex)
shopRoutes.get("/Checkout",getAuthUser,Checkout)
shopRoutes.get("/Locations",getAuthUser,Locations)
shopRoutes.post("/Remove-Cart-Item",getAuthUser,Remove_From_Cart)

module.exports = shopRoutes