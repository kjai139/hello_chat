
import axiosInstance from '../../../axios'



const checkLoginStatus = async (pathname, router, setUser) => {

    
    try {
        console.log('in', pathname)
        const response = await axiosInstance.get('/api/auth/check', {
            withCredentials: true
        })

        if (response.data.ok) {
            if (pathname === '/') {
                router.push('/dashboard')
            }
            else if (pathname === '/dashboard') {
                console.log(response.data.user, 'is logged in')
                setUser(response.data.user)
            }
        } else {
            router.push('/')
        }
    } catch (err) {
        console.log(err)
        router.push('/')
        setUser(null)
    }
}

const signOffUser = async (user) => {
    try {
        const response = await axiosInstance.post('/api/user/status/update', {
            userId: user._id,
            newStatus: 'offline'
        })
    } catch (err) {
        console.log(err)
    }
}

export {checkLoginStatus, signOffUser}