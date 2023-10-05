

import { Readex_Pro } from 'next/font/google'
import UserPortrait from '../../../svgs/userPortrait.svg'
import { useRef, useState } from "react"



const Profile = ({user}) => {

    const [selectedImage, setSelectedImage] = useState()
    

    const imageRef = useRef()

    const handleUploadImg = (e) => {
        
        console.log('selected img', e.target.files[0])
        setSelectedImage(e.target.files[0])

    }

    const clearImage = (e) => {
        e.preventDefault()
        setSelectedImage(null)
        imageRef.current.value = ''
    }
    return (
        <div className="flex flex-col flex-1 max-h-screen">
            <span className='border-b-2 p-4'>
                <h1 className="text-xl font-bold">User Settings</h1>
            </span>
            <form className="p-4 flex flex-col gap-4">
                
                <span>{user.username}</span>
                <div className="flex">
                    <div className='flex'>
                        {user.image ?
                            
                            <Image src={user.image}></Image>
                            
                            
                            :
                            <UserPortrait fill={user.defaultColor} className="portrait-img"></UserPortrait>
                        }
                <input type="file" accept="image/" onChange={handleUploadImg} ref={imageRef}></input>
                </div>
                <button type='button' onClick={clearImage}>Clear Image</button>
                
                        
                </div>
            </form>

        </div>
    )
}

export default Profile