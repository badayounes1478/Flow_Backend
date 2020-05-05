const mongoose = require('mongoose')
const schema = mongoose.Schema

const blog = new schema({
    title:String,
    content:String,
    destination:String,
    filename:String,
    download:String,
})

const Blog = mongoose.model('Blog',blog);
module.exports=Blog