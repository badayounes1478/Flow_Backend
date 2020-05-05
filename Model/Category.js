const mongoose = require('mongoose')
const schema = mongoose.Schema

const Category = new schema({
    category:String
})

const category1 = mongoose.model('Category',Category)
module.exports = category1