const {County,Town} = require('../Models/Locations')
const AddCounty = async(req,res)=>{
    const {county} = req.body
    //save the county to the database if there is none 
    const countyExists = await County.findOne({CountyName:county})
    if(countyExists){
        res.status(422).json({
            status:'error',
            message:'County Already Exists',
            code:422
        })
    }else{
        const newcounty = new County({
            CountyName:county
        })

        await newcounty.save()
        if(newcounty){
            res.status(200).json({
                status:'success',
                message:`${newcounty.CountyName} Successfully Added`,
                code:200
            })
        }else{
            res.status(422).json({
                status:'error',
                message:'County Could not be added',
                code:422
            })
        }
    }
}
const AddTown = async(req,res)=>{
    const {County,town,Fees} = req.body
    //check if the town exists 
    const townExists = await Town.findOne({County:County,Town:town})
    if(townExists){
        res.status(422).json({
            status:'error',
            message:`Town Already Exists`,
            code:422
        })
    }else{
        const newtown = new Town({
            County:County,
            TownName:town,
            ShippingFee:Fees
        })
        await newtown.save()

        if(newtown){
            res.status(200).json({
                status:'success',
                message:`${town} in ${County} County Added`,
                code:200
            })
        }else{
            res.status(422).json({
                status:'error',
                message:`Town Could not be added`,
                code:422
            })
        }
    }
}
const WorkOnTown = async (req, res)=>{
    const {townName,Action} = req.body
    const town  = await Town.findOne({TownName:townName})
    switch(Action){
        case 'Activate':
            town.status='Active'
            await town.save()
            res.status(200).json({
                status:'success',
                message:`Town Successfully Activated`,
                code:200
            })
            break;
        case 'Suspend':
            town.status='Inactive'
            await town.save()
            res.status(200).json({
                status:'success',
                message:`Town successfully Suspended`,
                code:200
            })
            break;
        case 'Delete':
            await Town.findOneAndDelete({TownName:townName})
            res.status(200).json({
                status:'success',
                message:`Town Successfully deleted`,
                code:200
            })
            break;
        default:
            res.status(422).json({
                status:'error',
                message:`Request Could not be understood`,
                code:422
            })

    }
}
const WorkOnCounty = async (req, res)=>{
    const {county,Action} = req.body
    const countyDetails  = await County.findOne({CountyName:county})
    switch(Action){
        case 'Activate':
            countyDetails.status='Active'
            await countyDetails.save()
            res.status(200).json({
                status:'success',
                message:`County Successfully Activated`,
                code:200
            })
            break;
        case 'Suspend':
            console.log('suspending')
            countyDetails.status='Inactive'
            await countyDetails.save()
            res.status(200).json({
                status:'success',
                message:`County successfully Suspended`,
                code:200
            })
            break
        case 'Delete':
            await County.findOneAndDelete({CountyName:county})
            const towns = await Town.find({County:county})
            if(towns){
                for(let i=0;i<towns.length;i++){
                    //delete respective whatever 
                    await towns[i].deleteOne()
                }
            }
            res.status(200).json({
                status:'success',
                message:`County and Towns Successfully Deleted`,
                code:200
            })
            break
        default:
            res.status(422).json({
                status:'error',
                message:`Request Could not be understood`,
                code:422
            })

    }
}
module.exports = {AddCounty,AddTown,WorkOnTown,WorkOnCounty}