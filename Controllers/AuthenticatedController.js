const Profiles =require('../Models/Profile')
const {Services,ServiceBooking} = require('../Models/Services')
const Products = require('../Models/Products')
const Category = require('../Models/Categories')
const Variation = require('../Models/Variations')
const Cart = require('../Models/Cart')
const Brand = require('../Models/Brands')
const Payments = require('../Models/Payments')
const Orders = require('../Models/Orders')
const InitiatePay = require('../Utils/Payments')
const InitPay = require('../Models/InitializedPayments')
const {County,Town} = require('../Models/Locations')
const url = require('url')
const Tokens = require('../Models/Tokens')
const path = require('path')
const generateRandom = require('../Utils/RandomUID')
const sendEmail = require('../Utils/MailSender')

const UserIndex = async(req,res)=>{
    const products = await Products.countDocuments()
    const cartItems = await Cart.countDocuments({Email:res.locals.user.EmailAddress,Status:'Active'})
    const orders = await Orders.countDocuments({Client:res.locals.user.EmailAddress})
    res.render('Backend/UserIndex.ejs',{cartItems,products,orders})
}
const Index = async (req,res)=>{
    const services = await Services.countDocuments()
    const products = await Products.countDocuments()
    const categories = await Category.countDocuments()
    const variations = await Variation.countDocuments()
    const cartItems = await Cart.countDocuments()
    const orders = await Orders.countDocuments({OrderStatus:'Active'})
    const wishlist = await Cart.countDocuments({Status:'Wishlist'})
    const brands = await Brand.countDocuments()
    const counties = await County.countDocuments()
    const towns = await Town.countDocuments()
    const payments = await Payments.find({Status:'Used'})
    let totalPayments =0
    for(let i=0;i<payments.length;i++){
        totalPayments = totalPayments+parseInt(payments[i].paymentAmount)
    }
    res.render('Backend/Index.ejs',{totalPayments,services,products,categories,variations,cartItems,brands,counties,towns,orders,wishlist})
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
const All_Orders = async (req,res)=>{
    const orders = await Orders.find({Client:res.locals.user.EmailAddress})
    res.render('Backend/All_Orders.ejs',{orders})
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
const BookService = async (req,res)=>{
    const {query} = url.parse(req.url,true)
    let serviceID = query.serviceID
    const service = await Services.findOne({_id:serviceID,Status:'Active'})
    res.render('Backend/Book_Service.ejs',{service})
}
const ServiceBookings = async(req,res)=>{
    const {serviceID,ServiceTitle,serviceDate,servicePrice} = req.body
    const service = await Services.findOne({_id:serviceID,Status:'Active'})
    //book the service 
    const bservice = new ServiceBooking({
        ServiceID:service._id,
        ServiceTitle:service.Title,
        Client:res.locals.user.EmailAddress,
        ServiceDate:serviceDate,
        Amount:service.Pay
    })
    await bservice.save()
    let paymentID = generateRandom(5)
    //initialize payment for the service 
    // const initLog = await InitPay.create({
    //     InitStatus:"Success",
    //     Message:"Done",
    //     AuthUrl:"dhhjd",
    //     AccessCode:"zxzxc",
    //     PaymentRef:service._id,
    //     PaymentReason:`Payment for Service ${service.Title}`,
    //     UserEmail:res.locals.user.EmailAddress,
    //     OurRef:paymentID,
    //     PaymentType:'Service',
    //     AmountPaid:service.Pay,
    // })
    // res.json(initLog)
    InitiatePay(res,paymentID,'Service',`Payment for Goods Plus Delivery for order ${service._id}`,service.Pay,res.locals.user.EmailAddress)
}
const Verify_Profile =  async (req,res)=>{
    const genToken = generateRandom(2)
    //check if the token exists and is used
    const tokenExists = await Tokens.findOne({
        userEmail:res.locals.user.EmailAddress,
        tokenType:'Verification',
        tokenStatus:'Not Used'
    })
    if(tokenExists){
        //user is verified
        res.render('Backend/Verify.ejs',{message:'We sent a code to your Email. Please Enter it Here'})
    }else{
        const token = Tokens.create({
            tokenValue:genToken,
            tokenType:'Verification',
            userEmail:res.locals.user.EmailAddress
        })
        //ask for verification code sent via email 
        //nodemailer 
        const emailResponse = await sendEmail (res.locals.user.EmailAddress, 'Please Verify Your Profile',genToken)
        res.render('Backend/Verify.ejs',{message:'We sent a code to your Email. Please Enter it Here'})
    }
}
const Verify_Token_Posted = async(req, res)=>{
    //generate the token 
    const {VerificationToken} = req.body
    const token = await Tokens.findOne({
        tokenValue:VerificationToken,
        userEmail:res.locals.user.EmailAddress,
        tokenType:'Verification',
        tokenStatus:'Not Used'
    })
    if(token){
        //verify the user account 
        const User = require('../Models/Users')
        const userData = await User.findOne({EmailAddress:res.locals.user.EmailAddress})
        userData.AccountStatus = 'Verified'
        userData.save()
        //set the token to used 
        token.tokenStatus = 'Used'
        token.save()
        res.status(200).json({
            status:'success',
            message:'Token Verified',
            code:200
        })
    }else{
        res.status(422).json({
            status:'error',
            message:'Incorrect Token Submitted',
            code:422
        })
    }
}
module.exports = {Index,Profile,All_Products,All_Services,
    All_Orders,GetProfileData,
    Add_Service,AcceptServiceData,
    Activate_Service,View_Service,
    BookService,
    Verify_Token_Posted,Suspend_Service,ServiceBookings,Delete_Service,UserIndex,Verify_Profile}