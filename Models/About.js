const {Schema,model} = require('mongoose')

//create the schema 
const AboutSchema = new Schema({
    //create the fields here 
    Mission:{
        type:String,
        required:[true,'This field is required'],
        Status:['Active','Suspended'],
        default:'Active'
    },
    Vission:{
        type:String,
        required:[true,'This field is required'],
        Status:['Active','Suspended'],
        default:'Active'
    },
    WelcomeText:{
        type:String,
        required:[true,'This field is required'],
        Status:['Active','Suspended'],
        default:'Active'
    },
},{timestamps:true})

const ProfessionSkillsSchema = new Schema({
    Skill:{
        type:String,
        required:[true,'This field is required'],
        Status:['Active','Inactive'],
        default:'Active'
    },
    SkillRating:{
        type:Number,
        required:[true,'This field is required'],
        default:0
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