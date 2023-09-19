'use client'

import { useContext, useEffect } from "react"
import checkLoginStatus from "../_modules/auth"
import { useRouter, usePathname } from "next/navigation"
import { userContext } from "../_context/authContext"
import Contact from '../../../svgs/contacts.svg'
import Settings from '../../../svgs/settings.svg'
import Image from "next/image"
import UserPortrait from '../../../svgs/userPortrait.svg?url'
import ChatWindow from "../_components/ChatWindow"

export default function Dashboard() {

    const router = useRouter()
    const pathname = usePathname()
    const { user, setUser} = useContext(userContext)

    useEffect(() => {
        checkLoginStatus(pathname, router, setUser)
        
    }, [])

    return (
        <main className="mx-auto max-w-5xl grid grid-cols-4 h-screen">
            <div className="bg-dgray text-white p-6 flex flex-col">
                <div className="flex justify-center">
                    <ul className="flex flex-col gap-4">
                        <li className="flex gap-4">
                            <Contact width="23" height="23" fill="white"></Contact>
                            <h1>Contacts</h1>
                        </li>
                        <li className="flex gap-4">
                            <Settings width="23" height="23" fill="white"></Settings>
                            <h1>Settings</h1>
                        </li>
                    </ul>
                </div>
                <div className="mt-auto justify-center flex">
                    {user && 
                    <div className="flex items-center gap-4">
                    {user.image ?
                    <Image src={user.image} height="23" width="23"></Image> :
                    <Image src={UserPortrait} height="23" width="23" alt="default portrait"></Image>
                    }
                    <span>{user.username}</span>
                    </div>
                    }
                </div>
            </div>
            <div className="bg-lgray text-white flex flex-col items-center">
                <h1>DIRECT MESSAGES</h1>

            </div>
            <div className="col-span-2">
                <ChatWindow user={user}></ChatWindow>

            </div>
        </main>
    )
}