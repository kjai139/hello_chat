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

    //real friendlist
    const [friendList, setFriendList] = useState([])


    useEffect(() => {
        checkLoginStatus(pathname, router, setUser)
        
        
    }, [])

    useEffect(() => {
        console.log(selectedUser, 'selected user on mount')
        if (!socket.connected) {
            socket.connect()
            
            
            
        }

        socket.on('connect', () => {
            console.log('client connected:', socket.id)
        })
        socket.on('message', (data) => {
            console.log('received msg from ws:', data)
            
            setmessageArr(prev => {
                if (prev === undefined) {
                    prev = []
                }
                return [...prev, data]
            })
        })
        socket.on('sameUserMsg', (data) => {
            console.log('received sameuserMsg from ws', data.content)
            setmessageArr((prev) => {
                const updatedMsgs = [...prev]
                updatedMsgs[updatedMsgs.length - 1].content = data.content

                return updatedMsgs
            })
        })

        socket.on('friend-login-status', (data) => {
            console.log(`${data.status} emit from login`, data)
            if (data.status === 'online') {
                setOnlineFriends(prev => [...prev, data.sender])
            } else if (data.status === 'offline') {
                setOnlineFriends((prev) => {
                    return prev.filter((id) => id !== data.sender)
                })
            }
        })
        socket.on("disconnect", (reason) => {
            console.log('dc reason', reason)
        })
        //have to make sure remove the listeners
        return () => {
            socket.removeAllListeners()
            
            socket.disconnect()
        }
    }, [])

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
            console.log(response.data.users, 'userlist')
            setSuggestedUsers(response.data.users)
            setFriendList(user.friends)
            socket.emit('login-status', {
                status: user.status,
                friends: response.data.users,
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
            const response = await axiosInstance.delete('api/auth/signout', {
                withCredentials: true
            })

            socket.emit('login-status', {
                status: 'offline',
                friends: suggestedUsers,
                sender: userId
            })
            console.log('offline socket emitted to backend')

            if (response.data.ok) {
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
                
                <DirectMessages onSelect={selectUser} setHL={setHighlight} highlight={highlight} prevTab={prevRefId} prevRef={tabRef} suggestedUsers={suggestedUsers} onlineUsers={onlineFriends} friendList={friendList}></DirectMessages>
                

            </div>
            <div className="col-span-2 bg-ltgray flex flex-col text-white">
                {user && selectedTab === 'chat' && <ChatWindow user={user} selectedUser={selectedUser} msgs={messageArr} setMsgs={setmessageArr} blankMsg={isBlank}></ChatWindow>}
                {selectedTab === 'settings' && user &&
                <Profile user={user}></Profile>
                }
                {selectedTab === 'friends' && user &&
                <FriendsTab friendList={friendList} setFriendList={setFriendList} freeFriends={suggestedUsers}></FriendsTab>
                }

            </div>
            
        </main>
    )
}