const Brand  = require('../Models/Brands')
const Category = require('../Models/Categories')
const Variation = require('../Models/Variations')
const {UploadFiles,UploadSingleFile} = require('../Utils/ImageUploader')
const Products = require('../Models/Products')
const path = require('path')
const url = require('url')
const generateRandom = require('../Utils/RandomUID')
const Create_Brands = async (req,res)=>{
    const brands = await Brand.find()
    const categories = await Category.find({Status:'Active'})
    res.render('Backend/Products/Brands.ejs',{brands,categories})
}
const Save_Brand = async (req,res)=>{
    const {BrandName,CategoryName} = req.body
    const files = req.files
    const fileNames = UploadFiles(files)
    //check if the brand exists to the database 
    const brand = await Brand.findOne({Brand:Brand})
    if(brand){
        res.status(422).json({
            status:'error',
            message:'Could Not Create the Brand',
            code:422
        })
    }else{
        const new_Brand = new Brand({
            Brand:BrandName,
            Image:fileNames[0],
            Category:CategoryName
        })
        await new_Brand.save()
        res.status(200).json({
            status:'success',
            message:`${new_Brand.Brand} Successfully Saved`,
            code:200
        })
    }
}

const Suspend_Brand = async (req,res)=>{
    let code;
    let message;
    let status;
    const {BrandID} = req.body
    const brand = await Brand.findById(BrandID)
    //if it exists 
    if(brand){
        brand.Status='Inactive'
        brand.save()
        code=200;
        message=`${brand.Brand} Successfully Suspended`
        status='success'
    }else{
        code=422;
        message=`Unknown error Occurred`
        status='error'
    }
    res.status(code).json({
        code,
        message,
        status
    })
}
const Activate_Brand = async (req,res)=>{
    let code;
    let message;
    let status;
    const {BrandID} = req.body
    const brand = await Brand.findById(BrandID)
    //if it exists 
    if(brand){
        brand.Status='Active'
        brand.save()
        code=200;
        message=`${brand.Brand} Successfully Activated`
        status='success'
    }else{
        code=422;
        message=`Unknown error Occurred`
        status='error'
    }
    res.status(code).json({
        code,
        message,
        status
    })
}
const Delete_Brand = async (req,res)=>{
    let code;
    let message;
    let status;
    const {BrandID} = req.body
    const brand = await Brand.findById(BrandID)
    //if it exists 
    if(brand){
        await Brand.findByIdAndDelete(BrandID)
        code=200;
        message=`${brand.Brand} Successfully Deleted`
        status='success'
    }else{
        code=422;
        message=`Unknown error Occurred`
        status='error'
    }
    res.status(code).json({
        code,
        message,
        status
    })
}
const Add_Category = async(req,res)=>{
    const categories = await Category.find()
    res.render('Backend/Products/Category.ejs',{categories})
}
const Save_Category = async (req,res)=>{
    const {CategoryName} = req.body
    const slug = (CategoryName).toString().split(" ").join("-")
    //create the category here 
    const category = new Category({
        Category:CategoryName,
        CategorySlug:slug
    })
    await category.save()
    if(category){
        res.status(200).json({
            code:200,
            status:'success',
            message:`${category.Category} Successfully Created`
        })
    }else{
        res.status(422).json({
            code:422,
            status:'error',
            message:'Unknown Error Occurred'
        })
    }
}
const WorkOn_Category = async(req,res)=>{
    let code;
    let message;
    let status;
    //get the category Id 
    const {CategoryID,Action} = req.body 
    //get the categories from the database 
    let category =  await Category.findById(CategoryID)
    if(!category){
        code=422
        status='error'
        message=`Unknown Error Occurred`
    }else{
        if(Action==='Activate'){
            category.Status='Active'
            category.save()
            code=200
            status='success'
            message=`${category.Category} Successfully Activated`
        }else if(Action ==='Suspend'){
            category.Status="Inactive"
            category.save()
            code=200
            status='success'
            message=`${category.Category} Successfully Suspended`
        }
        else if(Action==='Delete'){
            await Category.findByIdAndDelete(CategoryID)
            code=200
            status='success'
            message=`${category.Category} Successfully Deleted`
        }
        else{
            code=422
            status='error'
            message=`Unknown Error Occurred`
        }
        res.status(code).json({
            code:422,
            status:status,
            message:message
        })
    }
}
const Add_Product = async (req, res)=>{
    const categories = await Category.find({Status:'Active'})
    res.render("Backend/Products/Add_Products.ejs",{categories})
}
const Add_Variations = async(req,res)=>{
    const categories = await Category.find({Status:'Active'})
    const variations  = await Variation.find()
    res.render('Backend/Products/Variations.ejs',{variations,categories})
}
const Save_Variations = async(req,res)=>{
    const {VariationName,CategoryName} = req.body

    const variation = new Variation({
        Category:CategoryName,
        Variation:VariationName
    })

    await variation.save()
    if(variation){
        res.status(200).json({
            code:200,
            status:'success',
            message:`${variation.Variation} Successfully Added`
        })
    }else{
        res.status(422).json({
            code:422,
            status:'error',
            message:`Unknown Error Occurred`
        })
    }
}
const WorkOn_Variation = async(req,res)=>{
    let code;
    let message;
    let status;
    const {VariationID,Action} = req.body 
    let variation =  await Variation.findById(VariationID)
    if(!variation){
        code=422
        status='error'
        message=`Unknown Error Occurred`
    }else{
        if(Action==='Activate'){
            variation.Status='Active'
            variation.save()
            code=200
            status='success'
            message=`${variation.Variation} Successfully Activated`
        }else if(Action ==='Suspend'){
            variation.Status="Inactive"
            variation.save()
            code=200
            status='success'
            message=`${variation.Variation} Successfully Suspended`
        }
        else if(Action==='Delete'){
            await Variation.findByIdAndDelete(VariationID)
            code=200
            status='success'
            message=`${variation.Variation} Successfully Deleted`
        }
        else{
            code=422
            status='error'
            message=`Unknown Error Occurred`
        }
        res.status(code).json({
            code:422,
            status:status,
            message:message
        })
    }
}
const Load_Brands = async (req,res)=>{
    const {CategoryName} = req.body
    const cat = await Category.find({Category:CategoryName})
    if(cat){
        const brands = await Brand.find({Category:CategoryName,Status:'Active'})
        if(brands){
            res.status(200).json({
                code:200,
                status:'success',
                message:brands
            })
        }else{
            res.status(200).json({
                code:200,
                status:'success',
                message:[]
            })
        }
    }else{
        res.status(422).json({
            code:422,
            status:'error',
            message:'An Unknown error Occurred'
        })
    }
}
const Upload_Products = async (req,res)=>{
    const {ProductName,category,brand,Qty,Price,ProductDescription,Variants} = req.body
    const files = req.files
    const variantArray = (Variants).split(",")
    featuredImageName=UploadSingleFile(files.FeaturedImage)
    const fileNameArray=[]
    for(let i=0;i<files.OtherImages.length;i++){
        fileNameArray.push(files.OtherImages[i].name)
    }
    const product = new Products({
        ProductName:ProductName,
        ProductSlug : (ProductName).toString().split(" ").join("-"),
        ProductCategory:category,
        ProductImage:featuredImageName,
        ProductImages:files.OtherImages?fileNameArray:[],
        ProductDescription:ProductDescription,
        SKU:generateRandom(10),
        Brand:brand,
        Qty:Qty,
        Price:Price,
        ProductVariations:variantArray
    })

    await product.save()
    if(product){
        res.status(200).json({
            status:'success',
            code:200,
            message:`${product.ProductName} Successfully Created. Refreshing...`
        })
    }else{
        res.status(422).json({
            status:'error',
            code:422,
            message:`Could Not Create the Product`
        })
    }
}
const View_Product_Single = async(req,res)=>{
    const {query} = url.parse(req.url,true)
    const productSlug = query.Product
    const product = await Products.findOne({ProductSlug:productSlug,Status:'Active'})
    if(product){
        console.log(product)
        res.render('Backend/Products/Single.ejs',{product:product})
    }else{
        res.redirect("/All-Products")
    }
}
module.exports = {Create_Brands,Save_Brand,Suspend_Brand,Activate_Brand,Delete_Brand,
    Add_Category,Save_Category,WorkOn_Category,Add_Product,Save_Variations,View_Product_Single,Add_Variations,Upload_Products,Load_Brands,WorkOn_Variation}