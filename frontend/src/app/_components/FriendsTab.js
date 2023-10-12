import { useContext, useState } from "react"
import axiosInstance from '../../../axios'
import { userContext } from "../_context/authContext"
import ResultModal from "./modals/resultModal"
import { useRouter } from "next/navigation"


const FriendsTab = ({friendList, setFriendList, freeFriends}) => {

    const [friendName, setFriendName] = useState('')

    const {user} = useContext(userContext)
    const router = useRouter()

    const [resultMsg, setResultMsg] = useState('')
    const [needReroute, setNeedReroute] = useState(false)

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
            if (response.data.success) {
                const friend = response.data.friend
                const inFrds = user.friends.some(obj => obj._id === friend._id)
                const inFreeFrds = freeFriends.some(obj => obj._id === friend._id)
                if (inFrds || inFreeFrds) {
                    setResultMsg('User is already your friend.')
                    setFriendName('')
                } else {
                    try {
                        const response = await axiosInstance.post('api/users/addFriend', {
                            id: friend._id
                        }, {
                            withCredentials: true
                        })

                        if (response.data.success) {
                            setResultMsg(response.data.message)
                            console.log(response.data.updatedFriends)
                            setFriendList((prev) => {
                                if (prev === undefined) {
                                    prev = []
                                }
                                return [prev, ...response.data.updatedFriends]
                            })
                        } else {
                            setResultMsg(response.data.message)
                        }
                        
                    } catch (err) {
                        console.log(err, 'from nested add friends')
                        if (err.response.data.reroute) {
                            setResultMsg(err.response.data.message)
                            
                        }
                    }

                }
            }

        } catch (err) {
            console.log(err)
            if (err.response.data.reroute) {
                setResultMsg(err.response.data.message)
                setNeedReroute(true)
            }
        }
    }

    const handleCloseModal = (needReroute) => {
        if (needReroute) {
            router.push('/')
        } else {
            setResultMsg('')
        }
    }
    return (
        <div className="flex flex-col flex-1 max-h-screen relative">
             <span className='border-b-2 p-4'>
                <h1 className="text-xl font-bold">Add Friends</h1>
            </span>
            {resultMsg && <ResultModal resultMsg={resultMsg} closeModal={() => handleCloseModal(needReroute)}></ResultModal>}
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