const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const mongoose = require('mongoose')
const apiRouter = require('./routes/api')
const http = require('http')
const { Server } = require('socket.io')

const port = process.env.PORT || 4000
const mongodb = process.env.MONGO_LOGIN
const allowedOrigins = ['http://localhost:3000']
const server = http.createServer(app)
const SocketIoConfig = require('./socket')



const main = async () => {
    try {
        mongoose.connect(mongodb)
        console.log('mongodb connected')
    } catch (err) {
        console.log(err)
    }
}

main()

SocketIoConfig(server)

app.use(cors({
    origin:allowedOrigins,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))

app.use('/api', apiRouter)



server.listen(port, () => {
    console.log(`server running on port 4000`)
})