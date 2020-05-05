const express = require('express')
const router = express.Router()
const fs = require('fs')

router.get('/', (req, res, next) => {
    // The filename is simple the local directory and tacks on the requested url
    // This line opens the file as a readable stream
    res.writeHead(200, { 'Content-Type': 'video/mp4' });
    var readStream = fs.createReadStream('Video.mp4');

    // This will wait until we know the readable stream is actually valid before piping
    readStream.on('open', function () {
        readStream.pipe(res);
    });

    // This catches any errors that happen while creating the readable stream (usually invalid names)
    readStream.on('error', function (err) {
        res.end(err);
    });
})

module.exports = router