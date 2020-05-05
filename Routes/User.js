const express = require('express')
const user = require('../Model/User')
const jwt = require('jsonwebtoken')
const router = express.Router()

router.post('/signup', (req, res, next) => {
    user.find({ "deviceId": req.body.deviceId }).then(data => {
        if (data.length >= 1) {
            return res.status(200).json({
                message: 'User exists'
            })
        } else {
            user.create(req.body).then(data => {
                const token = jwt.sign({
                    id: data._id,
                    deviceId: data.deviceId
                }, "secret",
                    {
                        expiresIn: "90 days"
                    })
                return res.status(201).json({
                    message: 'User Created',
                    token: token,
                })
            })
        }
    })
})

router.post('/signin', (req, res, next) => {
    user.findOne({ name: req.body.name, password: req.body.password }).then(data => {
        if (data === null) {
            return res.status(401).json({
                message: 'Auth Failed'
            })
        } else {
            const token = jwt.sign({
                id: data._id,
                deviceId: data.deviceId
            }, "secret",
                {
                    expiresIn: "90 days"
                })
            return res.status(200).json({
                message: 'Auth Sucess',
                token: token,
            })
        }
    })
})

module.exports = router