const Profiles =require('../Models/Profile')
const Services = require('../Models/Services')
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
}
module.exports = {Index,Profile,All_Products,All_Services,All_Orders,GetProfileData,Add_Service,AcceptServiceData}