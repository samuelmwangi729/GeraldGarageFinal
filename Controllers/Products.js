const Brand  = require('../Models/Brands')
const Category = require('../Models/Categories')
const path = require('path')
const Create_Brands = async (req,res)=>{
    const brands = await Brand.find()
    res.render('Backend/Products/Brands.ejs',{brands})
}
const Save_Brand = async (req,res)=>{
    const {BrandName} = req.body
    const files = req.files
    const dirname = require('path').dirname;
    const absPath = (dirname(__filename)).toString()
    const splittedPath = absPath.split("\\")
    const newPath = []
    for(let i=0;i<splittedPath.length-1;i++){
        newPath.push(splittedPath[i])
    }
    const projectRoot = newPath.join("\\").toString()
    const fileNameArray = []
    if(files){
        Object.keys(files).map((item)=>{
            fileNameArray.push(files[item].name)
            // upload the files to the server 
            const filePath = path.join(projectRoot,'Resources','Uploads',files[item].name)
            files[item].mv(filePath,(err)=>{
                if(err){
                    console.log('Could not upload the images')
                }else{
                    console.log('uploaded the image')
                }
            })
        })
    }else{}
    //check if the brand exists to the database 
    const brand = await Brand.findOne({Brand:Brand})
    if(brand){
        res.status(422).json({
            status:'error',
            message:'Could Not Upload the Brand',
            code:422
        })
    }else{
        const new_Brand = new Brand({
            Brand:BrandName,
            Image:fileNameArray[0]
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
        message=`Unknown Error Occurreds`
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
module.exports = {Create_Brands,Save_Brand,Suspend_Brand,Activate_Brand,Delete_Brand,Add_Category,Save_Category,WorkOn_Category}