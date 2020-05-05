const express = require('express')
const router = express.Router()
const fs = require('fs')
const multer = require('multer')
const blog = require('../Model/Blog')

//configuring the multer
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'imageUploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

//declaring the multer
let upload = multer({ storage: storage }).single('image')

router.post('/uploadblog', upload, (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    if(req.body.title === "" || req.body.content === "")
    {
        res.send('Some fields are missing failed to upload')

    }else{
        blog.create({ title: req.body.title, content: req.body.content, destination: file.destination, filename: file.filename, download: file.path, playlistname: req.body.playlistname }).then(data => {
            res.send(data)
        })
    }
})

router.get('/blogimage/:id', (req, res, next) => {

    blog.findById(req.params.id).then(data => {
        let filePath = './imageUploads/' + data.filename
        const stat = fs.statSync(filePath)
        const fileSize = stat.size
        const range = req.headers.range
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-")
            const start = parseInt(parts[0], 10)
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize - 1
            const chunksize = (end - start) + 1
            const file = fs.createReadStream(filePath, { start, end })
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'image/jpg'
            }
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'image/jpg',
            }
            res.writeHead(200, head)
            fs.createReadStream(filePath).pipe(res)
        }
    }).catch(err=>{
        console.log(err)
    })
})

router.get('/all',(req, res, next)=>{
    blog.find().then(data=>{
        res.send(data)
    })
})


router.delete('/:id/:path', (req, res, next) => {
    let path = './imageUploads/' + req.params.path
    blog.deleteOne({ _id: req.params.id }).then(data => {
        if (data.deletedCount === 1) {
            fs.unlink(path, (err) => {
                if (err) {
                    return res.status(404).json('File Not Found')
                } else {
                    res.send({message:'File Deleted Succesfully'})
                }
           })
        }
    })
})


module.exports = router