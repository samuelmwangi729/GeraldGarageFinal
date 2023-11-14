const {Router} = require('express')
const {CartIndex,AddCart} = require('../Controllers/ShopController')
const {getAuthUser} = require('../Middlewares/Authentication')
const shopRoutes = Router()
shopRoutes.post("/Add-To-Cart",getAuthUser,AddCart)
shopRoutes.get("/Cart",getAuthUser,CartIndex)

module.exports = shopRoutes