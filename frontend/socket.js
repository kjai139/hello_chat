import { io } from "socket.io-client"

let url

if (process.env.NODE_ENV === 'production') {
    url = ''
} else {
    url = 'http://localhost:4000'
}

const socket = io(url, {
    withCredentials: true
})

export default socket