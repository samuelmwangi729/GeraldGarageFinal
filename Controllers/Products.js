const Brand  = require('../Models/Brands')
const path = require('path')
const Create_Brands = async (req,res)=>{
    res.render('Backend/Products/Brands.ejs')
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

module.exports = {Create_Brands,Save_Brand}