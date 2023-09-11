import axios from "axios";


let baseUrl

if (process.env.NODE_ENV === 'production') {
    baseUrl = ''
} else {
    baseUrl = 'http://localhost:4000'
}

const instance = axios.create({
    baseURL: baseUrl,
    timeout: 5000
})

export default instance