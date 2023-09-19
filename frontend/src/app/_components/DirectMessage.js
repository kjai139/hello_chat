import axiosInstance from '../../../axios'


const DirectMessages = ({selectUserConvo}) => {

    const getUserList = async () => {
        try {
            const response = await axiosInstance.get('/api/users/get')

            console.log(response.data.users)


        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div>

        </div>
    )
}


export default DirectMessages