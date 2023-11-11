const Profiles =require('../Models/Profile')
const Services = require('../Models/Services')
const path = require('path')
const Index = (req,res)=>{
    res.render('Backend/Index.ejs')
}
const Profile = async (req,res)=>{
    const userEmail = res.locals.user.EmailAddress
    const profile = await Profiles.findOne({Email:userEmail})
    res.render('Backend/Profile.ejs',{profile})
}
const All_Products = (req,res)=>{
    res.render('Backend/All_Products.ejs')
}
const All_Services = (req,res)=>{
    res.render('Backend/All_Services.ejs')
}
const All_Orders = (req,res)=>{
    res.render('Backend/All_Orders.ejs')
}
const GetProfileData = async(req,res)=>{
    const {Title,PhoneNumber,Residence,Age} = req.body
    //check if the profile exists 
    const userEmail = res.locals.user.EmailAddress
    const profile = await Profiles.findOne({Email:userEmail})
    if(profile){
        let data = {
            status:'success',
            message:'Profile Successfully Updated',
            code:200
        }
        res.status(200).json(data)
    }else{
        const newProfile = new Profiles({
        Email:userEmail,
        Title:Title,
        PhoneNumber:PhoneNumber,
        Residence:Residence,
        Age:Age
        })
        await newProfile.save()
        let data = {
            status:'success',
            message:'Profile Successfully Created',
            code:200
        }

        res.status(200).json(data)
    }
}
const Add_Service = async(req,res)=>{
    const services = await Services.find({Status:'Active'})
    res.render('Backend/Add_Services.ejs',{services:services})
}
const AcceptServiceData = async(req,res)=>{
    console.log(req.body)
    const {Title,
        Headline,
        Description} = req.body
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
    if(req.files){
        Object.keys(files).map((item)=>{
            fileNameArray.push(files[item].name)
            // upload the files to the server 
            const filePath = path.join(projectRoot,'Resources','Uploads',files[item].name)
            console.log(filePath)
            files[item].mv(filePath,(err)=>{
                if(err){
                    console.log('Could not upload the images')
                }else{
                    console.log('uploaded the image')
                }
            })
        })
    }else{}
    const service = new Services({
        Title:Title,
        Headline:Headline,
        Description:Description,
        Photo:fileNameArray[0]
    })
    await service.save()
    if(service){
        res.status(200).json({
            status:'success',
            message:'data successfully saved',
            code:200
        })
    }else{
        res.status(422).json({
            status:'error',
            message:'data could not be saved',
            code:422
        })
    }
}
module.exports = {Index,Profile,All_Products,All_Services,All_Orders,GetProfileData,Add_Service,AcceptServiceData}