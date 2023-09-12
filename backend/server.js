const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const apiRouter = require('./routes/api')

const port = process.env.PORT || 4000
const mongodb = process.env.MONGO_LOGIN
const allowedOrigins = ['http://localhost:3000']

const main = async () => {
    try {
        mongoose.connect(mongodb)
        console.log('mongodb connected')
    } catch (err) {
        console.log(err)
    }
}

main()

app.use(cors({
    origin:allowedOrigins,
    credentials: true
}))

app.use('/api', apiRouter)

app.listen(port, () => {
    console.log(`server running on port 4000`)
})