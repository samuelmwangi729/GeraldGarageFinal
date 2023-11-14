const Profiles =require('../Models/Profile')
const Services = require('../Models/Services')
const Products = require('../Models/Products')
const url = require('url')
const path = require('path')
const Index = async (req,res)=>{
    const services = await Services.find({Status:'Active'})
    res.render('Backend/Index.ejs',{services:services.length})
}
const Profile = async (req,res)=>{
    const userEmail = res.locals.user.EmailAddress
    const profile = await Profiles.findOne({Email:userEmail})
    res.render('Backend/Profile.ejs',{profile})
}
const All_Products = async (req,res)=>{
    const products = await Products.find({Status:'Active'})
    res.render('Backend/All_Products.ejs',{products})
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
    const services = await Services.find()
    res.render('Backend/Add_Services.ejs',{services:services})
}
const AcceptServiceData = async(req,res)=>{
    const {Title,
        Headline,
        Pay,
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
        Pay:Pay,
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
const Activate_Service = async (req,res)=>{
    let code ;
    let message ;
    let status ;
    let {ServiceID} = req.body
    if(!ServiceID){
        code = 422
        message=`Invalid Data Submitted`
        status='error'
    }else{
        const service = await Services.findById(ServiceID)
        if(service){
            //the service exists
            service.Status='Active'
            service.save()
            code = 200
            message=`${service.Title} Successfully Activated`
            status='success'
        }else{
            code = 422
            message=`Service Could not be  Activated`
            status='error'
        }
    }
    res.status(code).json({
        status,
        message,
        code
    })
    //get the service
}
const View_Service = async (req,res)=>{
    let code ;
    let message ;
    let status ;
    let {ServiceID} = req.body
    if(!ServiceID){
        code = 422
        message=`Invalid Data Submitted`
        status='error'
    }else{
        const service = await Services.findById(ServiceID)
        if(service){
            //the service exists
            code = 200
            message=service
            status='success'
        }else{
            code = 422
            message=`Service Could not be Found`
            status='error'
        }
    }
    res.status(code).json({
        status,
        message,
        code
    })
}
const Suspend_Service = async (req,res)=>{
    let code ;
    let message ;
    let status ;
    let {ServiceID} = req.body
    console.log("backend called")
    if(!ServiceID){
        code = 422
        message=`Invalid Data Submitted`
        status='error'
    }else{
        const service = await Services.findById(ServiceID)
        if(service){
            //the service exists
            service.Status='Inactive'
            service.save()
            code = 200
            message=`${service.Title} Successfully Suspended`
            status='success'
            console.log(service)
        }else{
            code = 422
            message=`Service Could not be  Suspended`
            status='error'
        }
    }
    res.status(code).json({
        status,
        message,
        code
    })
}
const Delete_Service = async (req,res)=>{
    let code ;
    let message ;
    let status ;
    let {ServiceID} = req.body
    console.log("backend called")
    if(!ServiceID){
        code = 422
        message=`Invalid Data Submitted`
        status='error'
    }else{
        const service = await Services.findById(ServiceID)
        if(service){
            //the service exists
            await Services.findByIdAndDelete(ServiceID)
            code = 200
            message=`Service Successfully Deleted`
            status='success'
            console.log(service)
        }else{
            code = 422
            message=`Service Could not be Deleted`
            status='error'
        }
    }
    res.status(code).json({
        status,
        message,
        code
    })
}
module.exports = {Index,Profile,All_Products,All_Services,
    All_Orders,GetProfileData,
    Add_Service,AcceptServiceData,
    Activate_Service,View_Service,
    Suspend_Service,Delete_Service}