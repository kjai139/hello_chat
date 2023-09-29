

const { Server } = require('socket.io')

let origin

if (process.env.NODE_ENV === 'production'){
    origin = ''
} else {
    origin = ["http://localhost:3000", "http://localhost:3001"]
}

module.exports = (server) => {
    const io = new Server(server, {
        cors: {
            origin: origin,
            methods: ['GET', 'POST'],
            credentials: true
        }
    })

    io.on('connection', (socket) => {
        console.log('A user has connected.')

        socket.on('disconnect', () => {
            console.log('User disconnected')
        })
    })

    module.exports.io = io
}
