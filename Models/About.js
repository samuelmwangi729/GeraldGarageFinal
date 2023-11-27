const {Schema,model} = require('mongoose')

//create the schema 
const AboutSchema = new Schema({
    //create the fields here 
    Headline:{
        type:String,
        required:[true,'Headline field is required'],
    },
    Mission:{
        type:String,
        required:[true,'This field is required'],
    },
    Vission:{
        type:String,
        required:[true,'This field is required'],
        
    },
    WelcomeText:{
        type:String,
        required:[true,'This field is required'],
    },
    Description:{
        type:String,
        required:[true,'This field is required'],
    },
    BannerImage:{
        type:String,
        required:[true,'This field is required'],
    },
    Status:{
        type:String,
        enum:['Active','Suspended'],
        default:'Active'
    }
},{timestamps:true})

const ProfessionSkillsSchema = new Schema({
    Skill:{
        type:String,
        required:[true,'This field is required'],
    },
    SkillRating:{
        type:Number,
        required:[true,'This field is required'],
        default:0
    },
    Status:{
        type:String,
        enum:['Active','Suspended'],
        default:'Active'
    }
},{timestamps:true})

const TeamMembersSchema = new Schema({
    Title:{
        type:String,
        required:[true,'This field is required'],
    },
    Name:{
        type:String,
        required:[true,'This field is required'],
    },
    Description:{
        type:String,
        required:[true,'This field is required']
    },
    Photo:{
        type:String,
        required:[true,'This field is required'],
        default:'none.png'
    },
    Status:{
        type:String,
        enum:['Active','Suspended'],
        default:'Active'
    }
},{timestamps:true})

const TestimonialSchema = new Schema({
    Headline:{
        type:String,
        required:[true,'This field is required'],
    },
    Description:{
        type:String,
        required:[true,'This field is required']
    },
    Name:{
        type:String,
        required:[true,'This field is required'],
    },
    Title:{
        type:String,
        required:[true,'This field is required'],
    },
    Photo:{
        type:String,
        required:[true,'This field is required'],
        default:'none.png'
    },
    Status:{
        type:String,
        enum:['Active','Suspended'],
        default:'Active'
    }
},{timestamps:true})

const CounterSchema = new Schema({
    Cases:{
        type:Number,
        required:[true,'This field is required'],
    },
    Clients:{
        type:Number,
        required:[true,'This field is required'],
    },
    Offices:{
        type:Number,
        required:[true,'This field is required'],
    },
    SkilledPeople:{
        type:Number,
        required:[true,'This field is required'],
    },
},{timestamps:true})


const About = model('About',AboutSchema)
const ProfessionSkills = model('ProfessionSkills',ProfessionSkillsSchema)
const TeamMember= model('TeamMember',TeamMembersSchema)
const Testimonial= model('Testimonial',TestimonialSchema)
const Counter = model('Counter',CounterSchema)

module.exports = {
About,
ProfessionSkills,
TeamMember,
Testimonial,
Counter,
}