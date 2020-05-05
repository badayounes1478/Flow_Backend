const express = require('express')
const router = express.Router()
const fs = require('fs')
const multer = require('multer')
const song = require('../Model/Audio')
const category_type = require('../Model/Category')
const subcategory_type = require('../Model/Sub_Category')

//configuring the multer
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

//declaring the multer
let upload = multer({ storage: storage }).array('audio', 100)


// saving the song in the database
router.post('/uploadfile', upload, (req, res, next) => {
    const file = req.files
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.setHeader('Content-Type', 'application/json');

    if (req.body.category === "" || req.body.sub_category === "") {

        res.send('Some fields are missing failed to upload')

    } else {
        file.map(data => {
            song.create({ category: req.body.category, sub_category: req.body.sub_category, destination: data.destination, filename: data.filename, download: data.path, playlistname: req.body.playlistname }).then(data1 => {
            })
        })
        res.send('Done')
    }

})


router.get('/song/:id', (req, res, next) => {

    song.findById(req.params.id).then(data => {
        let filePath = './uploads/' + data.filename
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
                'Content-Type': 'audio/mpeg'
            }
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            }
            res.writeHead(200, head)
            fs.createReadStream(filePath).pipe(res)
        }
    }).catch(err => {
        console.log(err)
    })
})


router.delete('/:id/:path', (req, res, next) => {
    let path = './uploads/' + req.params.path
    song.deleteOne({ _id: req.params.id }).then(data => {
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

router.get('/all', (req, res, next) => {
    song.find().then(data => {
        res.send(data)
    })
})

router.post('/category', (req, res, next) => {
    if (req.body.category === '') {
        res.send('Faild To Add')
    } else {
        category_type.create(req.body).then(data => {
            res.send(data)
        })
    }
})


router.get('/category/all', (req, res, next) => {
    category_type.find().then(data => {
        res.send(data)
    })
})

router.post('/sub_category', (req, res, next) => {
    if (req.body.sub_category === "") {
        res.send('Failed to add')
    } else {
        subcategory_type.create(req.body).then(data => {
            res.send(data)
        })
    }
})


router.get('/sub_category/all', (req, res, next) => {
    subcategory_type.find().then(data => {
        res.send(data)
    })
})



module.exports = router