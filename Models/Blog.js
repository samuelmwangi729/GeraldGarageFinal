const {Schema , model} = require('mongoose')

const PostCategoriesSchema = new Schema({
    Title:{
        type:String,
        required:[true,'This field is required']
    },
    Status:{
        type:String,
        enum:['Active','Inactive'],
        default:'Active'
    }
},{timestamps:true})
const BlogTagsSchema = new Schema({
    Title:{
        type:String,
        required:[true,'This field is required']
    },
    Status:{
        type:String,
        enum:['Active','Inactive'],
        default:'Active'
    }
},{timestamps:true})
const BlogSchema = new Schema({
    Title:{
        type:String,
        required:[true,'This field is required']
    },
    FeaturedImage:{
        type:String,
        default:'none.png'
    },
    Headline:{
        type:String,
        required:[true,'This field is required'],
    },
    Description:{
        type:String,
        required:[true,'This field is required'],
    },
    Category:{
        type:String,
        required:[true,'This field is required']
    },
    Author:{
        type:String,
        required:[true,'This field is required']
    },
    Tags:{
        type:Array,
        required:[true,'This field is required']
    },
    Status:{
        type:String,
        enum:['Active','Inactive','Pending'],
        default:'Pending'
    }
},{timestamps:true})
const PostTags = model('PostTags',BlogTagsSchema)
const PostCategory = model('PostCategory',PostCategoriesSchema)
const Blog = model('Blog',BlogSchema)

module.exports = {PostCategory, Blog,PostTags}