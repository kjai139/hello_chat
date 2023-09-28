'use client'

import { Suspense, useContext, useEffect, useState } from "react"
import checkLoginStatus from "../_modules/auth"
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



export default function Dashboard() {

    const router = useRouter()
    const pathname = usePathname()
    const { user, setUser, selectedUser, setSelectedUser} = useContext(userContext)

    const [needRefresh, setNeedRefresh] = useState(false)
    const [messageArr, setmessageArr] = useState([])

    

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
        }
    }

    const selectUser = async (user) => {
        setSelectedUser(user)
        setmessageArr()
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
                    <ul className="flex flex-col gap-4">
                        <li className="flex gap-4 userUi">
                            <Contact width="23" height="23" fill="white"></Contact>
                            <h1>Contacts</h1>
                        </li>
                        <li className="flex gap-4 userUi">
                            <Settings className="portrait-img" fill="white"></Settings>
                            <h1>Settings</h1>
                        </li>
                        <li className="flex gap-4 userUi" onClick={signOut}>
                            <SignOff className="portrait-img" fill="white"></SignOff>
                            <h1 className="w-full">Sign out</h1>
                        </li>
                    </ul>
                </div>
                <div className="mt-auto justify-center flex">
                    {user && 
                    <div className="flex items-center gap-4 w-full justify-center">
                    {user.image ?
                    <Image src={user.image} height="23" width="23"></Image> :
                    <UserPortrait fill={user.defaultColor} className="portrait-img"></UserPortrait>
                    }
                    <span className="font-bold">{user.username}</span>
                    </div>
                    }
                </div>
            </div>
            <div className="bg-lgray text-white flex flex-col items-center">
                <span className={`text-sm w-full p-4 `}>DIRECT MESSAGES</span>
                
                <DirectMessages onSelect={selectUser}></DirectMessages>
                

            </div>
            <div className="col-span-2 bg-ltgray flex flex-col">
                <ChatWindow user={user} selectedUser={selectedUser} msgs={messageArr} setMsgs={setmessageArr}></ChatWindow>

            </div>
            
        </main>
    )
}