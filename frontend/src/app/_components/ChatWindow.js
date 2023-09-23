import Image from "next/image"
import UserPortrait from '../../../svgs/userPortrait.svg'
import { useState } from "react"

const ChatWindow = ({selectedUser, userId, msgs, user}) => {

    const [message, setMessage] = useState('')

    const sendMessage = (e) => {
        e.preventDefault()
        console.log('message:', message)
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
            {msgs && msgs.map((node, idx) => {
                return (
                    <div className={node.sender === user._id ? 'userMsg-div' : 'incMsg-div'} key={node._id}>
                        
                    </div>    
                )
            })}
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