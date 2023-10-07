const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const debug = require('debug')('hello_chat:imageController')
require('dotenv').config()
const User = require('../models/userModel')

const s3Client = new S3Client({
    region: 'us-east-2',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET
    }
})

const generateTimestamp = () => {
    return Date.now()
}

const generateRandomStr = () => {
    return Math.random().toString(36).substring(2, 8)
}

exports.image_upload_post = async (req, res) => {

    const filename = req.file.originalname
    const bucketname = 'hellochatbucket'
    const s3Keyname = `${generateRandomStr()}_${generateTimestamp()}_${filename}`

    const params = {
        Bucket: bucketname,
        Key:`avatars/${s3Keyname}`,
        Body: req.file.buffer,
        ContentType: 'image/x-icon',
        ACL: 'public-read'
    }

    try {
        const command = new PutObjectCommand(params)
        const response = await s3Client.send(command)

        const curUser = await User.findByIdAndUpdate(req.user._id, {
            image: `https://${bucketname}.s3.us-east-2.amazonaws.com/${params.Key}`
        })
        res.json({
            message: `User avatar updated.`,
            success: true
        })
    } catch (err) {
        res.status(500).json({
            message: err
        })
    }
    
    
}