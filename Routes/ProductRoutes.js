const {Router} = require('express')
const fileUploader = require('express-fileupload')
const {Create_Brands,Save_Brand,Suspend_Brand,Activate_Brand,Delete_Brand,Add_Category,Save_Category,WorkOn_Category} = require('../Controllers/Products')
const productRoutes = Router()

productRoutes.get("/Create-Brands",Create_Brands)
.get("/Add-Category",Add_Category)
.post('/Save-Category',Save_Category)
.post("/Save-Brand",fileUploader({createParentPath:true}),Save_Brand)
.post("/Suspend-Brand",Suspend_Brand)
.post("/Activate-Brand",Activate_Brand)
.post("/Delete-Brand",Delete_Brand)
.post('/WorkOn_Category',WorkOn_Category)
module.exports = productRoutes