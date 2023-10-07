const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator')
const debug = require('debug')('hello_chat:accountController')
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.account_create_post = [
    body('username')
    .trim()
    .isLength({min: 1}).withMessage('username must not be blank')
    .matches(/^[a-zA-Z0-9]/).withMessage('Username must not contain symbols')
    .escape(),
    body('password')
    .isLength({min:6}).withMessage('Password must have at least 6 characters')
    .matches(/^(?=.*[a-z])/).withMessage('Password must have at least one lowercase letter')
    .matches(/^(?=.*[A-Z])/).withMessage('Password must have at least one uppercase letter')
    .matches(/^(?=.*[!@#$%^&()_+-])/).withMessage('Password must contain at least one symbol'),

    

    async (req, res) => {
        const errors = validationResult(req)
        debug(req.body.username, req.body.password)

        if (!errors.isEmpty()) {
            debug('errors validating create user post')
            return res.status(400).json({
                message:'Username must not contain symbols and Passwords must have one uppercase, one lowercase, and one symbol.'
            })
        } else {
            debug('no errors validating in create user')
            try {
                const { username, password } = req.body
                const salt = await bcrypt.genSalt(10)
                const hashedPw = await bcrypt.hash(password, salt)
                const normalizedName = username.toLowerCase()
                debug('creating user to mongodb')
                const newUser = new User({
                    username: username,
                    password: hashedPw,
                    normalized_name: normalizedName
                })

                await newUser.save()

                
                res.json({
                    success: true,
                    message: 'User had successfully registered.'
                })
            } catch(err) {
                if (err.code === 11000) {
                    res.status(400).json({
                        message: 'User already exists.'
                    })
                } else {
                    res.status(500).json({
                        message: err
                    })
                }
                
            }
        }
    }
]


exports.account_login_post = async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    try {
        const user = await User.findOne({
            username: username
        })

        debug('user', user)

        if (!user) {
            res.status(400).json({
                message: 'The user does not exist.'
            })
        } else {
            const passwordsMatch = await bcrypt.compare(password, user.password)

            if (passwordsMatch) {
                if (user.status === 'offline') {
                    user.status = 'online'
                    await user.save()
                }
            const token = jwt.sign({
                _id: user._id,
                username: user.username,
                normalized_name: user.normalized_name,
                friends: user.friends,
                email: user.email,
                defaultColor: user.defaultColor,
                status: user.status,
                image: user.image
            }, process.env.JWT_SECRET_KEY, {
                expiresIn: '1hr'
            })

            res.cookie('jwtToken', token, {
                httpOnly:true,
                secure: true,
                maxAge: 60* 60* 1000,
                sameSite: 'None'
            })

            res.json({
                success: true,
                message: 'Login successful'
            })
        } else {
            res.json({
                message: 'Password incorrect'
            })
        }}} catch (err) {
        res.status(500).json({
            message: err
        })
    }
}