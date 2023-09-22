import { useEffect, useState } from 'react'
import axiosInstance from '../../../axios'
import Image from 'next/image'
import UserPortrait from '../../../svgs/userPortrait.svg'


const DirectMessages = ({onSelect}) => {

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
        <ul className='flex flex-col w-full p-2'>
            {suggestedUsers && 
            suggestedUsers.map((node) => {
                return (
                    <li key={node._id} className='flex p-2 hover:border-black rounded-lg border-4 border-transparent friendlist' onClick={() => onSelect(node)}>
                        <div className='flex w-full justify-start items-center gap-2'>
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