const {Router} = require('express')
const fileUploader = require('express-fileupload')
const {Create_Brands,Save_Brand} = require('../Controllers/Products')
const productRoutes = Router()

productRoutes.get("/Create-Brands",Create_Brands)
.post("/Save-Brand",fileUploader({createParentPath:true}),Save_Brand)

module.exports = productRoutes