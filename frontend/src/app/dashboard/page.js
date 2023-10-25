'use client'

import { Suspense, useContext, useEffect, useRef, useState } from "react"
import {checkLoginStatus, signOffUser} from "../_modules/auth"
import { useRouter, usePathname } from "next/navigation"
import { userContext } from "../_context/authContext"
import Contact from '../../../svgs/contacts.svg'
import Settings from '../../../svgs/settings.svg'
import SignOff from '../../../svgs/sign-off.svg'
import Image from "next/image"
import UserPortrait from '../../../svgs/userPortrait.svg'
import ChatWindow from "../_components/ChatWindow"
import DirectMessages from "../_components/DirectMessage"
import axiosInstance from '../../../axios'
import Profile from "../_components/Profile"
import socket from "../../../socket"
import FriendsTab from "../_components/FriendsTab"
import { TiltNeon } from "../fonts"


export default function Dashboard() {

    const router = useRouter()
    const pathname = usePathname()
    const { user, setUser, selectedUser, setSelectedUser} = useContext(userContext)

    
    const [messageArr, setmessageArr] = useState([])

    const [selectedTab, setSelectedTab] = useState('')
    const [isBlank, setIsBlank] = useState(false)

    const [highlight, setHighlight] = useState()

    // localstorage last selected
    const tabRef = useRef(null)
    const [prevRefId, setPrevRefId] = useState()

    //for free friendlist
    const [suggestedUsers, setSuggestedUsers] = useState()
    
    const [onlineFriends, setOnlineFriends] = useState([])
    const [offlineFriends, setOfflineFriends] = useState([])

    //real friendlist
    const [friendList, setFriendList] = useState([])
    const [pendingFriends, setPendingFriends] = useState([])

    //unread
    const [unreadMsg, setUnreadMsg] = useState([])


    useEffect(() => {
        checkLoginStatus(pathname, router, setUser)
       
        
    }, [])

    useEffect(() => {
        console.log('updated unreadMsg', unreadMsg)
        console.log('online frds updated', onlineFriends)
        console.log('offline friends', offlineFriends)
    }, [unreadMsg, onlineFriends, offlineFriends])

    useEffect(() => {
        if (user) {
            console.log(selectedUser, 'selected user on mount')
        if (!socket.connected) {
            socket.connect()
            
            
            
        }

        socket.on('connect', () => {
            

            
            console.log('client connected:', socket.id)
            // socket.emit('joinRoom', user._id)
            
            
        })
        socket.on('message', (data) => {
            console.log('received msg from ws:', data)
            // console.log('selected user:', selectedUser, 'hl', highlight, 'prev state', prevRefId)
            // console.log(localStorage.getItem('lastSelected'), 'localstorage')
            const curWindow = localStorage.getItem('lastSelected')
            if (curWindow === data.sender._id.toString() || user._id === data.sender._id.toString()) {
                setmessageArr(prev => {
                    if (!prev || prev.length === 0) {
                        return [data]
                    } else {
                        return [...prev, data]
                    }
                    
                })
            } else {
                setUnreadMsg((prev) => {
                    if (prev && prev.length > 0) {
                        console.log('prev > 0 unread')
                        return [...prev, data]
                        
                    } else {
                        console.log('unread blank')
                       return [data]
                        
                    }
                })
                
            }
            
        })
        socket.on('sameUserMsg', (data) => {
            console.log('received sameuserMsg from ws', data.content, data)
            const curWindow = localStorage.getItem('lastSelected')
            if (curWindow === data.sender._id.toString() || user._id === data.sender._id.toString()) {
                setmessageArr((prev) => {
                    const updatedMsgs = [...prev]
                    updatedMsgs[updatedMsgs.length - 1].content = data.content
    
                    return updatedMsgs
                })
            } else {
                setUnreadMsg((prev) => {
                    if (prev && prev.length > 0) {
                        console.log('unread same msg len > 0 received', prev.length)
                        return [...prev, data]
                        
                    } else {
                        console.log('new unread same msg 0')
                        return [data]
                        
                    }
                })
                
            }
            
        })

        socket.on('userLogged', (data) => {
            console.log('received emit from userlogged')
            router.push('/')
        })

        socket.on('joinnedRoom', (data) => {
            console.log(`user joinned room ${data.room}`)
        })

        socket.on('incFrdReq', (data) => {
            console.log(`received friendreq from ${data.newPending}/${data.newPending.username}`)
            if (pendingFriends.length > 0) {
                setPendingFriends(prev => [...prev, data.newPending])
            } else {
                setPendingFriends([data.newPending])
            }
        })

        socket.on('deletedByFrd', (data) => {
            console.log(`deleted by ${data.deletedBy}`)
            setFriendList((prev) => {
                return prev.filter((obj) => obj._id.toString() !== data.deletedBy.toString())
            })
        })

        socket.on('addedByFrd', (data) => {
            if (friendList.length > 0) {
                setFriendList((prev) => [...prev, data.newFriend])
                setSuggestedUsers((prev) => {
                    return prev.filter((obj) => obj._id.toString() !== data.newFriend._id.toString())
                })
            } else {
                setFriendList([data.newFriend])
                setSuggestedUsers((prev) => {
                    return prev.filter((obj) => obj._id.toString() !== data.newFriend._id.toString())
                })
            }
        })

        socket.on('friend-login-status', (data) => {
            console.log(`${data.status} emit from login`, data)
            if (data.status === 'online') {
                if (!onlineFriends.some(obj => obj.toString() === data.sender.toString() )) {
                    setOnlineFriends(prev => [...prev, data.sender])
                
                }
                setOfflineFriends((prev) => {
                    return prev.filter((id) => id.toString() !== data.sender.toString())
                })
                
            } else if (data.status === 'offline') {
                setOnlineFriends((prev) => {
                    return prev.filter((id) => id.toString() !== data.sender.toString())
                })
                if (!offlineFriends.some(obj => obj.toString() === data.sender.toString() ) && offlineFriends.length === 0) {
                    setOfflineFriends([data.sender])
                
                } else if (!offlineFriends.some(obj => obj.toString() === data.sender.toString() ) && offlineFriends.length > 0) {
                    setOfflineFriends(prev => [...prev, data.sender])
                }
                
                
               
            }
        })

        socket.on('friend-logout', (data) => {
            console.log('RECEIVED FRIEND LOGOUT EMIT')
        })

        
        
        socket.on("disconnect", (reason) => {
            console.log('dc reason', reason)
        })
        //have to make sure remove the listeners
        return () => {
            socket.removeAllListeners()
            
            socket.disconnect()
        }
        }
        
    }, [user])

    useEffect(() => {
        if (user) {
            socket.emit('joinRoom', user._id)
            
            
        }
    }, [user])

   

    useEffect(() => {
        if (user) {
            getUserList()
        }
        
    }, [user])

    const getUserList = async () => {
        try {
            const response = await axiosInstance.get('/api/users/get', {
                withCredentials: true
            })

            console.log('user from getuserlist', user)
            console.log(response.data.users, 'free friendlist')
            console.log(response.data.newUser, 'updated User object on refresh')
            setSuggestedUsers(response.data.freeFriends)
            setFriendList(response.data.newUser.friends)
            setPendingFriends(response.data.newUser.friendRequests)
            socket.emit('login-status', {
                status: user.status,
                friends: response.data.newUser.friends,
                freeFriends: response.data.freeFriends,
                sender: user._id
            })
            console.log('online socket emitted to backend')
            

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const prevUserState = localStorage.getItem('lastSelected')
       

        if (prevUserState && !prevRefId) {
            console.log('prev selected:', prevUserState)
            console.log('tableref cur', tabRef.current)
            console.log(!prevRefId)
            setPrevRefId(prevUserState)
            setTimeout(() => {
                if (tabRef.current) {
                    tabRef.current.click()
                }
            }, 1000)
            
        } else if (!prevUserState) {
            setPrevRefId('nothing')
        }
    }, [])

   

    const signOut = async () => {
        const userId = user._id
        try {
            const response = await axiosInstance.post('api/auth/signout', {
                freeFriends: suggestedUsers,
            }, {
                withCredentials: true
            })

            if (response.data.ok) {
                console.log('response data on logout', response.data.friends)
                setUser()
                router.push('/')
                
                
                
                
                
            }

            
            

           


        } catch (err) {
            console.log(err)
            if (err.response.data.reroute) {
                signOffUser(user)
                setUser()
                router.push('/')
            }
        }
    }

    const selectUser = async (user) => {
        setSelectedUser(user)
        setIsBlank(false)
        setmessageArr(null)
        setUnreadMsg((prev) => {
            if (prev && prev.length > 0) {
                prev.filter((obj) => obj._id.toString() !== user._id.toString())
            }
            
        })
        console.log(user, 'selected')
        try {
            const response = await axiosInstance.post('api/convo/get', {
                selectedUser: user._id
            }, {
                withCredentials: true
            })

            console.log(response.data.message)
            if (response.data.success) {
                console.log(response.data.messageArr)
                setmessageArr(response.data.messageArr)
                setSelectedTab('chat')
            } else {
                setSelectedTab('chat')
                setIsBlank(true)
                
            }
        } catch (err) {
            console.log(err)
            if (err.response.data.reroute) {
                router.push('/')
            }
        }
    }

    const selectUiTab = (tab) => {
        setSelectedTab(tab) 
        setHighlight(tab);
        
    }

    return (
        <main className="mx-auto max-w-5xl grid grid-cols-4 h-screen bg-black">
            
            <div className="bg-dgray text-white p-6 flex flex-col">
                <div className="flex justify-center w-full">
                    <ul className="flex flex-col gap-4 w-full">
                        <li className={ highlight === 'friends' ? `flex gap-4 userUi font-bold pointer-events-none` : `flex gap-4 userUi`} onClick={() => selectUiTab('friends')}>
                           <div className="w-4 flex items-center ">
                            <Contact fill="white" className="portrait-img"></Contact>
                            </div>
                            <h1 className="flex-1">Friends</h1>
                            <span className="flex gap-1">
                            <h1 className={`${TiltNeon.className} text-red-500`}>NEW</h1>
                            <h1 className="pending-count">{pendingFriends ? `${pendingFriends.length}`: `0`}</h1>
                            </span>
                           
                        </li>
                        <li className={ highlight === 'settings' ? `flex gap-4 userUi font-bold pointer-events-none` : `flex gap-4 userUi`} onClick={() => selectUiTab('settings')}>
                            <div className="w-4 flex items-center ">
                            <Settings className="portrait-img" fill="white"></Settings>
                            </div>
                            <h1 className={ highlight === 'settings' ? `flex-1 font-bold pointer-events-none` : `flex-1`}>Settings</h1>
                        </li>
                        <li className="flex gap-4 userUi" onClick={signOut}>
                            <div className="w-4 flex items-center">
                            <SignOff className="portrait-img" fill="white"></SignOff>
                            </div>
                            <h1 className="flex-1">Sign out</h1>
                        </li>
                    </ul>
                </div>
                <div className="mt-auto justify-center flex">
                    {user && 
                    <div className="flex items-center gap-2 w-full justify-center">
                    <div className="w-8 relative">
                    {user.image ?
                    
                    <div className='portrait-img flex h-8 w-8'>
                            <Image src={user.image} width={30} height={30} alt="profileImg" style={{
                                borderRadius: '50%'
                            }}></Image>
                    </div>
                    
                     :
                    <UserPortrait fill={user.defaultColor} className="portrait-img"></UserPortrait>
                    }
                    <span className={`status-indi ${user.status === 'offline' && 'offline'}`}></span>
                    </div>

                   
                   
                    <span className="font-bold">{user.username}</span>
                    </div>
                    }
                </div>
            </div>
            <div className="bg-lgray text-white flex flex-col items-center">
                <span className={`text-sm w-full p-4 `}>DIRECT MESSAGES</span>
                
                <DirectMessages onSelect={selectUser} setHL={setHighlight} highlight={highlight} prevTab={prevRefId} prevRef={tabRef} suggestedUsers={suggestedUsers} onlineUsers={onlineFriends} friendList={friendList} setFriendList={setFriendList} unreadMsg={unreadMsg} offlineFriends={offlineFriends}></DirectMessages>
                

            </div>
            <div className="col-span-2 bg-ltgray flex flex-col text-white">
                {user && selectedTab === 'chat' && <ChatWindow user={user} selectedUser={selectedUser} msgs={messageArr} setMsgs={setmessageArr} blankMsg={isBlank}></ChatWindow>}
                {selectedTab === 'settings' && user &&
                <Profile user={user} setUser={setUser}></Profile>
                }
                {selectedTab === 'friends' && user &&
                <FriendsTab friendList={friendList} setFriendList={setFriendList} freeFriends={suggestedUsers} pendingRequests={pendingFriends} onlineUsers={onlineFriends} setPendingRequests={setPendingFriends} setFreeFriends={setSuggestedUsers}></FriendsTab>
                }

            </div>
            
            
        </main>
    )
}