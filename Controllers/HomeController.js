const Index = (req,res)=>{
    res.render('Frontend/Homepage.ejs')
}

const About = (req,res)=>{
    res.render('Frontend/About.ejs')
}

const Services = (req,res)=>{
    res.render('Frontend/Services.ejs')
}

const Projects = (req,res)=>{
    res.render('Frontend/Projects.ejs')
}
const Blog = (req,res)=>{
    res.render('Frontend/Blog.ejs')
}
const Contact = (req,res)=>{
    res.render('Frontend/Contact.ejs')
}


module.exports = {Index,About,Services,Projects,Blog,Contact}