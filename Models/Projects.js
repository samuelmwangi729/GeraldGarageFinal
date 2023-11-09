const {Schema,model } = require('mongoose')

const ProjectSchema = new Schema({
    Title:{
        type:String,
        required:[true,'This field is required']
    },
    Category:{
        type:String,
        required:[true,'This field is required']
    },
    Photo:{
        type:String,
        required:[true,'This field is required']
    },
    Status:{
        type:String,
        enum:['Active','Inactive'],
        default:'Active',
        required:[true,'This field is required']
    },
},{
    timestamps:true
})

const Projects = model('Projects',ProjectSchema)
module.exports = Projects