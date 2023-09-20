import { useEffect, useState } from 'react'
import axiosInstance from '../../../axios'
import Image from 'next/image'
import UserPortrait from '../../../svgs/userPortrait.svg'


const DirectMessages = ({selectUserConvo}) => {

    const [suggestedUsers, setSuggestedUsers] = useState()

    useEffect(() => {
        getUserList()
    }, [])

    const getUserList = async () => {
        try {
            const response = await axiosInstance.get('/api/users/get')

            console.log(response.data.users, 'userlist')
            setSuggestedUsers(response.data.users)


        } catch (err) {
            console.log(err)
        }
    }

    
    return (
        <ul className='flex flex-col w-full'>
            {suggestedUsers && 
            suggestedUsers.map((node) => {
                return (
                    <li key={node._id} className='flex'>
                        <div className='flex w-full justify-center'>
                            {node.image ? 
                            <Image src={node.image} className='portrait-img'></Image> :
                            <UserPortrait className="portrait-img" fill={node.defaultColor}></UserPortrait>
                            }
                            <span>{node.username}</span>
                        </div>

                    </li>
                )
            })
            }
            

        </ul>
    )
}


export default DirectMessages