const mongoose = require('mongoose')
const schema = mongoose.Schema


const User = new schema({
    name:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    deviceId:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('User',User)