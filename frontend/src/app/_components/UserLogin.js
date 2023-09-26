'use client'

import { useContext, useEffect, useState } from "react"

import axiosInstance from '../../../axios'
import Spinner from "./Loader"
import ResultModal from "./modals/resultModal"
import { Josefin } from "../fonts"
import { userPasswordValidationSchema, userValidationScehma } from "../_schemas/authSchemas"
import * as yup from 'yup'
import { useRouter, usePathname } from "next/navigation"
import checkLoginStatus from "../_modules/auth"
import { userContext } from "../_context/authContext"





const UserLogin = () => {

    const [isUserCreatingAcc, setIsUserCreatingAcc] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [resultMsg, setResultMsg] = useState('')

    const router = useRouter()
    const pathname = usePathname()

    const { user, setUser } = useContext(userContext)

    useEffect(() => {
        checkLoginStatus(pathname, router, setUser)
        console.log(user, 'checking user state')
    }, [])

    const handleCreateAcc = (e) => {
        e.preventDefault()
        setIsUserCreatingAcc(true)
        setUsername('')
        setPassword('')
    }

    const handleBacktoLogin = (e) => {
        e.preventDefault()
        setIsUserCreatingAcc(false)
        setUsername('')
        setPassword('')
    }

    const loginUser = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await axiosInstance.post('/api/account/login', {
                username: username,
                password: password
            }, {
                withCredentials: true
            })
            
            if (response.data.success) {
                router.push('/dashboard')
            } else {
                setIsLoading(false)
                setResultMsg(response.data.message)
                setUsername('')
                setPassword('')
            }
        } catch (err) {
            console.log(err)
            setIsLoading(false)
            setResultMsg(err.response.data.message)
            setUsername('')
            setPassword('')
        }
    }

    

    
    

    const createUser = async (e) => {
        e.preventDefault()
        console.log(username, password)
        setIsLoading(true)
        try {
            await userValidationScehma.validate({
                userName: username
            })
            await userPasswordValidationSchema.validate({
                userPassword: password
            })
            const response = await axiosInstance.post('/api/account/create', {
                username: username,
                password: password
            }, {
                withCredentials: true
            })

            if (response.data.success) {
                setIsLoading(false)
                setResultMsg(response.data.message)
                setUsername('')
                setPassword('')
                setIsUserCreatingAcc(false)
                
            }

        } catch (err) {
            if (err instanceof yup.ValidationError) {
                setResultMsg(err.errors)
                setIsLoading(false)
            } else {
                console.log(err)
                setResultMsg(err.response.data.message)
                setIsLoading(false)
                setUsername('')
                setPassword('')
            }
            
        }
    }

   

    return (
        <div className="shadow-cont p-4 animate-slide-in">
            {isLoading &&
            <Spinner></Spinner> 
            }
            {resultMsg &&
            <ResultModal resultMsg={resultMsg} closeModal={() => setResultMsg('')}></ResultModal> 
            }
        <h1 className="font-bold md:text-2xl lg:text-3xl">Hello Chat Messenger</h1>
        <form className="flex flex-col gap-2">
            {isUserCreatingAcc ? 
            <h1 className={`${Josefin.className} animate-fade-in`}>Creating account</h1>
            :
            <h1 className={`${Josefin.className}`}>Log In</h1>
            }
            <div className="input-cont">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" className="custom-input" autoComplete="off" onChange={e => setUsername(e.target.value)} value={username}></input>
            </div>
            <div className="input-cont">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" className="custom-input" onChange={e => setPassword(e.target.value)} value={password}></input>
            </div>
           {isUserCreatingAcc ? 
           <div className="flex justify-between">
           <div>
               <button type="button" className="text-blue-500 p-1 animate-fade-in" onClick={handleBacktoLogin}>{'<- Back to Login'}</button>
           </div>       
           
           <div>
               <button className="text-blue-500 p-1 animate-fade-in" onClick={createUser}>Create Account</button>
           </div>
           </div>
           :
           <div className="flex justify-between">
                  
                <div>
                    <button type="button" className="text-blue-500 p-1" onClick={handleCreateAcc}>Create a new account</button>
                </div>
                <div>
                    <button className="text-blue-500 p-1" onClick={loginUser}>Login</button>
                </div>
            </div>}
        </form>
        </div>
    )
}

export default UserLogin