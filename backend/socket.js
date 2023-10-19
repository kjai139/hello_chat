

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

        socket.on('joinRoom', (userId) => {
            socket.join(userId)
            console.log(`User ${userId} has joinned room ${userId}`)
        })


        socket.on('login-status', (sender) => {
            
            
            
                sender.friends.forEach((frd) => {
                    console.log('friend Id from socket:', frd._id)
                    console.log('sender', sender.sender, 'status:', sender.status)
                    
                    socket.to(frd._id).emit('friend-login-status', {
                        sender: sender.sender,
                        status: sender.status
                    })
                   
                })
                sender.freeFriends.forEach((frd) => {
                    socket.to(frd._id).emit('friend-login-status', {
                        sender: sender.sender,
                        status: sender.status
                    })
                    
    
                    
    
                })
                
        
            

            
        })

        socket.on('redirectReq', (data) => {
            socket.to(data.sender).emit('userLogged')
        })

        socket.on('disconnecting', () => {
            console.log('socket rooms', socket.rooms)
        })

        socket.on('disconnect', () => {
            console.log('User disconnected')
            console.log('socket rooms size: ', socket.rooms.size)
        })
    })

    module.exports.io = io
}
