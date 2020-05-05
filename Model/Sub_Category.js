const mongoose = require('mongoose')
const schema = mongoose.Schema

const Sub_Category = new schema({
    sub_category :String
})

const sub_cat = mongoose.model('Sub_Category',Sub_Category)
module.exports = sub_cat