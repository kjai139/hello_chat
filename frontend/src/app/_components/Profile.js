

import { Readex_Pro } from 'next/font/google'
import UserPortrait from '../../../svgs/userPortrait.svg'
import { Suspense, useRef, useState } from "react"
import Image from 'next/image'
import axiosInstance from '../../../axios'
import { useRouter } from 'next/navigation'
import ResultModal from './modals/resultModal'
import Spinner from './Loader'



const Profile = ({user}) => {

    const [selectedImageUrl, setSelectedImageUrl] = useState()
    const [resultMsg, setResultMsg] = useState('')

    const imageRef = useRef()
    const router = useRouter()

    const handleUploadImg = (e) => {
        
        console.log('selected img', e.target.files[0])
        

        const file = e.target.files[0]
        if (file) {
            const imgUrl = URL.createObjectURL(file)
            setSelectedImageUrl(imgUrl)
        }

    }

    const updateSettings = async (e) => {
        e.preventDefault()
        console.log(imageRef.current.files[0])
        const img = imageRef.current.files[0]
        

        if (img) {
            const formData = new FormData()
            formData.append('image', img)
            formData.append('filename', img.name)
            try {
                const response = await axiosInstance.post('/api/image/upload', formData, {
                    withCredentials: true
                })

                console.log(response.data.message)
                if (response.data.success) {
                    setResultMsg(response.data.message)
                }
            } catch (err) {
                console.log(err)
                if (err.response.data.reroute) {
                    router.push('/')
                }
            }
        }
    }

    const clearImage = (e) => {
        e.preventDefault()
        
        setSelectedImageUrl(null)
        imageRef.current.value = ''
    }
    return (
        <div className="flex flex-col flex-1 max-h-screen relative">
            
            {resultMsg && 
            
            <ResultModal resultMsg={resultMsg} closeModal={() => setResultMsg('')}></ResultModal>
            
            }
            
            <span className='border-b-2 p-4'>
                <h1 className="text-xl font-bold">User Settings</h1>
            </span>
            <form className="p-4 flex flex-col gap-4">
                
                <span className='flex gap-2'>
                    <h1 className='font-bold'>Username:</h1>
                    <h1>{user.username}</h1>
                </span>
                <span>
                    <h1 className='font-bold'>Profile Avatar</h1>
                </span>
                <div className="flex">
                    <div className='flex items-center gap-2'>
                        {user.image && !selectedImageUrl &&
                            <div className='portrait-img flex h-8 w-8'>
                            <Image src={user.image} width={30} height={30} style={{
                                borderRadius: '50%'
                            }}></Image>
                            </div>
                            
                        }    
                        { !user.image && !selectedImageUrl &&
                        <div className='portrait-img w-8'>
                            <UserPortrait fill={user.defaultColor} className="portrait-img"></UserPortrait>
                        </div>
                        }
                         
                        {selectedImageUrl &&
                        <div className='portrait-img flex w-8 h-8'>
                        <Image src={selectedImageUrl} alt='uploadedFile' width={30} height={30} style={{
                            borderRadius:'50%'
                        }}></Image>
                        </div>
                        }
                        
                <input type="file" accept="image/" onChange={handleUploadImg} ref={imageRef}></input>
                </div>
                
                <button type='button' onClick={clearImage} className='flex-2 border-2 py-1 px-2 radius-2 rounded-lg bg-dgray border-dgray'>Reset</button>
                
                
                
                        
                </div>
                <div className='mt-5 flex justify-end'>
                    <button type='submit' className='border-2 px-2 py-1 rounded-lg bg-dgray border-dgray ' onClick={updateSettings}>Update Settings</button>
                </div>
               
            </form>

        </div>
    )
}

export default Profile