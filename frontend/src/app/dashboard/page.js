'use client'

import { Suspense, useContext, useEffect, useState } from "react"
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



export default function Dashboard() {

    const router = useRouter()
    const pathname = usePathname()
    const { user, setUser, selectedUser, setSelectedUser} = useContext(userContext)

    const [needRefresh, setNeedRefresh] = useState(false)
    const [messageArr, setmessageArr] = useState([])

    const [selectedTab, setSelectedTab] = useState('')
    const [isBlank, setIsBlank] = useState(false)

    

    useEffect(() => {
        checkLoginStatus(pathname, router, setUser)
        
        
    }, [])

    useEffect(() => {
        if (needRefresh) {
            checkLoginStatus(pathname, router, setUser)
            setNeedRefresh(false)
        }
    }, [needRefresh])

    const signOut = async () => {
        const userId = user._id
        try {
            const response = await axiosInstance.delete('api/auth/signout', {
                withCredentials: true
            })

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

    return (
        <main className="mx-auto max-w-5xl grid grid-cols-4 h-screen">
            
            <div className="bg-dgray text-white p-6 flex flex-col">
                <div className="flex justify-center w-full">
                    <ul className="flex flex-col gap-4 w-full">
                        <li className="flex gap-4 userUi">
                           <div className="w-4 flex items-center ">
                            <Contact fill="white" className="portrait-img"></Contact>
                            </div>
                            <h1 className="flex-1">Friends</h1>
                           
                        </li>
                        <li className="flex gap-4 userUi" onClick={() => setSelectedTab('settings')}>
                            <div className="w-4 flex items-center ">
                            <Settings className="portrait-img" fill="white"></Settings>
                            </div>
                            <h1 className="flex-1">Settings</h1>
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
                            <Image src={user.image} width={30} height={30} style={{
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
                
                <DirectMessages onSelect={selectUser}></DirectMessages>
                

            </div>
            <div className="col-span-2 bg-ltgray flex flex-col text-white">
                {user && selectedTab === 'chat' && <ChatWindow user={user} selectedUser={selectedUser} msgs={messageArr} setMsgs={setmessageArr} blankMsg={isBlank}></ChatWindow>}
                {selectedTab === 'settings' && user &&
                <Profile user={user}></Profile>
                }

            </div>
            
        </main>
    )
}