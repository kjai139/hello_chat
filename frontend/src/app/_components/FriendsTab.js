import { useContext, useState } from "react"
import axiosInstance from '../../../axios'
import { userContext } from "../_context/authContext"
import ResultModal from "./modals/resultModal"
import { useRouter } from "next/navigation"
import Image from "next/image"
import UserPortrait from '../../../svgs/userPortrait.svg'


const FriendsTab = ({friendList, setFriendList, freeFriends, setFreeFriends, pendingRequests, onlineUsers, setPendingRequests}) => {

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
            //friend located
            console.log(response.data.message)
            if (response.data.success) {
                const friend = response.data.friend
                const inFrds = user.friends.some(obj => obj._id === friend._id)
                const inFreeFrds = freeFriends.some(obj => obj._id === friend._id)
                const inPending = pendingRequests.some(obj => obj._id === friend._id)
                //already friends
                if (inFrds) {
                    setResultMsg('User is already your friend.')
                    setFriendName('')
                } else if (inPending) {
                    //friend is in user's pending requests
                    try {
                        const response = await axiosInstance.post('api/users/addFriend', {
                            id: friend._id
                        }, {
                            withCredentials: true
                        })

                        if (response.data.success) {
                            setResultMsg(response.data.message)
                            console.log('new friend added from inpending', response.data.newFriend)
                            setFriendList((prev) => {
                                if (prev === undefined) {
                                    prev = []
                                }
                                return [...prev, response.data.newFriend]
                            })

                            setFreeFriends((prev) => {
                                return prev.filter((obj) => obj._id.toString() !== friend._id)
                            })

                            const filteredPending = pendingRequests.filter((obj) => {
                                return obj._id !== response.data.newFriend._id
                            })

                            setPendingRequests(filteredPending)
                            
                        } else {
                            setResultMsg(response.data.message)
                        }
                        
                    } catch (err) {
                        console.log(err, 'from nested add friends')
                        if (err.response.data.reroute) {
                            setResultMsg(err.response.data.message)
                            
                        }
                    }
                    //not in pending or friends
                } else {
                    try {
                        const response = await axiosInstance.post('api/users/sendReq', {
                            id: friend._id
                        }, {
                            withCredentials: true
                        })

                        if (response.data.success) {
                           setResultMsg(response.data.message)
        
                        } else {
                            setResultMsg(response.data.message)
                        }
                    } catch (err) {
                        console.log(err, 'from send frd req')
                        if (err.response.data.reroute) {
                            setResultMsg(err.response.data.message)
                            
                        }
                    }
                }
            } else {
                setResultMsg(response.data.message)
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

    const declineFriend = async (friendId) => {
        try {
            const response = await axiosInstance.post('api/users/declineFriend', {
                id: friendId
            }, {
                withCredentials: true
            })

            if (response.data.success) {
                console.log(`${friendId}'s friend request declined.`)
                const filteredPending = pendingRequests.filter((obj) => {
                    return obj._id !== friendId
                })
                setPendingRequests(filteredPending)
            }

            
        } catch (err) {
            console.log(err)
        }
    }

    const acceptFriend = async (friendId) => {
        console.log('accepting -', friendId)
        try {
            const response = await axiosInstance.post('api/users/addFriend', {
                id: friendId
            }, {
                withCredentials: true
            })

            if (response.data.success) {
                setResultMsg(response.data.message)
                console.log(`friend ${friendId} added`)
                setFriendList((prev) => {
                    if (prev === undefined) {
                        prev = []
                    }
                    return [...prev,response.data.newFriend]
                })

                setFreeFriends((prev) => {
                    return prev.filter((obj) => obj._id !== friendId)
                })

                
                const filteredPending = pendingRequests.filter((obj) => {
                    return obj._id !== response.data.newFriend._id
                })

                setPendingRequests(filteredPending)
            }

        } catch (err) {
            console.log(err, 'error from accepting friend')
        }
    }
    return (
        <div className="flex flex-col flex-1 max-h-screen relative">
             <span className='border-b-2 p-4 selected-top'>
                <h1 className="text-xl font-bold">Add Friends</h1>
            </span>
            {resultMsg && <ResultModal resultMsg={resultMsg} closeModal={() => handleCloseModal(needReroute)}></ResultModal>}
            <form className="p-4 flex flex-col gap-4">
                <label>Enter username:</label>
                <input type="text" placeholder="Enter here..." onChange={handleFriendNameInput} className="p-1 text-black" value={friendName}></input>
                <div className='mt-5 flex justify-end'>
                    <button type='submit' className='pending-btn' onClick={addFriend}>Add</button>
                </div>
            </form>
            
            <span className='border-b-2 p-4 selected-top'>
                <h1 className="text-xl font-bold">Pending Friend Requests</h1>
            </span>
            {pendingRequests && 
            pendingRequests.map((node) => {
                return (
                    <div key={`pending-${node._id}`} className="flex p-4 gap-2 items-center">
                        
                    {node.image ?
                        <div className="w-8 relative">
                        <div className='portrait-img flex h-8 w-8'>
                        <Image src={node.image} width={30} height={30} alt="profileImg" style={{
                            borderRadius: '50%'
                        }}></Image>
                       </div>
                       <span className={node.status === 'online' || onlineUsers.includes(node._id) ? `status-indi` : `status-indi offline`}></span>
                       </div>
                        
                        
                        :
                        <div className="w-8 relative">
                        <UserPortrait fill={node.defaultColor} className="portrait-img"></UserPortrait>
                        
                        <span className={node.status === 'online' || onlineUsers.includes(node._id) ? `status-indi` : `status-indi offline`}></span>
                        </div>
                        }
                        
                        <span>{node.username}</span>
                        <div className="flex gap-2 ml-auto">
                        <button className="pending-btn" type="button" onClick={() => acceptFriend(node._id)}>Accept</button>
                        <button className="pending-btn" type="button" onClick={() => declineFriend(node._id)}>Decline</button>
                        </div>
                    </div>
                
                )
            })
            }

            

        </div>
    )
}

export default FriendsTab