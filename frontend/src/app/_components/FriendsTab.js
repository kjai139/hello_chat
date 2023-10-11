import { useContext, useState } from "react"
import axiosInstance from '../../../axios'
import { userContext } from "../_context/authContext"

const FriendsTab = () => {

    const [friendName, setFriendName] = useState('')

    const {user} = useContext(userContext)

    const handleFriendNameInput = (e) => {
        setFriendName(e.target.value)
    }

    const addFriend = async (e) => {
        e.preventDefault()
        console.log(user.friends)
        try {
            const response = await axiosInstance.get(`/api/users/add?name=${friendName}`, {
                withCredentials: true
            })

            console.log(response.data.message)

        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div className="flex flex-col flex-1 max-h-screen relative">
             <span className='border-b-2 p-4'>
                <h1 className="text-xl font-bold">Add Friends</h1>
            </span>
            <form className="p-4 flex flex-col gap-4">
                <label>Enter username:</label>
                <input type="text" placeholder="Enter here..." onChange={handleFriendNameInput} className="p-1 text-black" value={friendName}></input>
                <div className='mt-5 flex justify-end'>
                    <button type='submit' className='border-2 px-2 py-1 rounded-lg bg-dgray border-dgray ' onClick={addFriend}>Add</button>
                </div>
            </form>

        </div>
    )
}

export default FriendsTab