import Image from "next/image"
import UserPortrait from '../../../svgs/userPortrait.svg'
import { useEffect, useState } from "react"
import axiosInstance from '../../../axios'
import socket from "../../../socket"


const ChatWindow = ({selectedUser, userId, msgs, user}) => {

    const [message, setMessage] = useState('')
    const [chatlog, setChatLog] = useState()

    useEffect(() => {
        if (!socket.connected) {
            socket.connect()
        }

        socket.on('connect', () => {
            console.log('client connected:', socket.id)
        })
        socket.on('message', (data) => {
            console.log('received msg from ws:', data)
        })
        //have to make sure remove the listeners
        return () => {
            socket.off('message')
            socket.off('connect')
            socket.disconnect()
        }
    }, [])

    const sendMessage = async (e) => {
        e.preventDefault()
        
        try {
            const response = await axiosInstance.post('/api/messages/send', {
                message: message,
                users: [user._id, selectedUser._id],
                sender: user._id
            }, {
                withCredentials: true
            })
            console.log('message:', message)
            console.log('users:', user, selectedUser)
            if (response.data.success) {
                setMessage('')
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            sendMessage(e)
        } else if (e.key === 'Enter' && e.shiftKey) {
            
        }
    }
    return (
        <div className="flex flex-col flex-1">
            <div className="flex p-4 gap-2 border-b-2 selected-top">
            {selectedUser && selectedUser.image ? 
                <Image src={selectedUser.image} className='portrait-img'></Image> : selectedUser &&
                <UserPortrait className="portrait-img" fill={selectedUser && selectedUser.defaultColor && selectedUser.defaultColor}></UserPortrait>
            }
                <span className="text-white font-bold">{selectedUser && selectedUser.username}</span>
            
            </div>
            <div>
            {msgs && msgs.map((node, idx) => {
                console.log(node, 'node')
                return (
                    <div className='flex' key={node._id}>
                        
                        {node.image ? 
                            <Image src={node.image} className='portrait-img'></Image> :
                            <UserPortrait className="portrait-img" fill={node.defaultColor}></UserPortrait>
                            }
                        
                        <div className="flex flex-col">
                            <span>{node.sender.username}</span>
                            <span>{node.content}</span>
                        </div>
                    </div>    
                )
            })}
            </div>
            {
                selectedUser &&
                <form onSubmit={sendMessage} className="p-4 flex items-end flex-1">
                    <textarea placeholder={`Message@${selectedUser.username}`} value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={handleKeyPress} className="resize-none w-full p-2"></textarea>
                </form>
            }

        </div>
    )
}

export default ChatWindow