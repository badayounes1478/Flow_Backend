const mongoose = require('mongoose')
const schema = mongoose.Schema

const songs = new schema({
    category:String,
    sub_category:String,
    destination:String,
    filename:String,
    download:String,
    playlistname:String
})

const song = mongoose.model('Songs',songs);
module.exports=song