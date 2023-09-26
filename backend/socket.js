

const { Server } = require('socket.io')



module.exports = (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
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
