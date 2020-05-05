const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')

//setting up the app
const app = express()

//connect to the monogo db
mongoose.connect('mongodb+srv://Roshan:roshan@cluster0-hetj0.mongodb.net/MusicData?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

app.use('/video', require('./videoStream'))
app.use('/audio', require('./Routes/audioStream'))
app.use('/user', require('./Routes/User'))
app.use('/blog', require('./Routes/Blog'))


app.get('/', (req, res, next) => {
    res.sendFile('Signin.html', { root: __dirname })
})


app.get('/in', (req, res, next) => {
    res.sendFile('index1.html', { root: __dirname })
})


app.get('/blogAdd', (req, res, next) => {
    res.sendFile('Blog.html', { root: __dirname })
})


app.listen(process.env.PORT || 4000, () => {
    console.log('Running on port 4000')
})