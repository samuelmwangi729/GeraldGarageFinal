const {Schema, model} = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new Schema({
    FullName:{
        type:String,
        required:[true,'This field is required']
    },
    EmailAddress:{
        type:String,
        required:[true,'This field is required']
    },
    Password:{
        type:String,
        required:[true,'This field is required']
    },
    Role:{
        type:String,
        enum:['Admin','Client','User'],
        required:[true,'This field is required'],
        default:'Client'
    },
    isStaff:{
        type:String,
        enum:['Staff','notStaff'],
        required:[true,'This field is required'],
        default:'notStaff'
    },
    AccountStatus:{
        type:String,
        enum:['Verified','Unverified','Inactive','Suspended'],
        required:[true,'This field is required'],
        default:'Unverified'
    },
},{timestamps:true})
// userSchema.pre('save',async function(next){
//     const salt = await bcrypt.genSalt(10)
//     this.Password = await bcrypt.hash(this.password,salt)
//     next()
// })
userSchema.statics.Login= async (email,password)=>{
    const user = await User.findOne({EmailAddress:email})
    if(user){
        const passMatch =  await bcrypt.compare(password,user.Password)
        if(passMatch){
            return true
        }else{
            return false
        }
    }else{
        return false
    }
}
userSchema.statics.getUID = async (username)=>{
    const user = await User.findOne({EmailAddress:username})
    const splittedString = (user._id).toString().split("\"")
    let userId=splittedString[0]
    return userId
}
const User = model('User',userSchema)

module.exports = User