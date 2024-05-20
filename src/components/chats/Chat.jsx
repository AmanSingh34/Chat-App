import React, { useEffect, useRef, useState } from 'react'
import "./chat.css"
import EmojiPicker from 'emoji-picker-react'
import {arrayUnion, doc, getDoc, onSnapshot, updateDoc} from "firebase/firestore"
import {db} from "../../lib/firabase"
import { useChatStore } from '../../lib/chatStore'
import { useUserStore } from '../../lib/userStore'
import upload from '../../lib/upload'

function Chat() {
  const [open,setOpen] = useState(false)
  const [chats,setChats] = useState(null)
  const [text,setText] = useState("")
  const [img,setImg] = useState({
    file:null,
    url:""
  })
  
  const endRef = useRef(null)
  const {chatId,user,isCurrentBlocked,isReceiverBlocked} = useChatStore()
  const {currentUser} = useUserStore()

  useEffect(()=>{
    endRef.current?.scrollIntoView({behavior:"smooth"})
  },[])

  useEffect(()=>{
    const unSub = onSnapshot(doc(db,"chats",chatId),(res)=>{
      setChats(res.data())
    })

    return () =>{
      unSub();
    }
  },[chatId])
  console.log(chats);

  const handleEmoji = (e)=>{
    setText(prev => prev+e.emoji)
    setOpen(false)
  }

  const handleImg = (e) =>{
    if(e.target.files[0]){
      setImg({
          file:e.target.files[0],
          url:URL.createObjectURL(e.target.files[0])
      })
  }
  }

  const handleSend = async () =>{
    if (text === "") return;

    let imgUrl = null;

    try {

      if(img.file){
        imgUrl = await upload(img.file)
      }

      await updateDoc(doc(db,"chats",chatId),{
        messages:arrayUnion({
          senderId:currentUser.id,
          text,
          createdAt:new Date(),
          ...(imgUrl && {img:imgUrl}) //here it will only go when it will be there otherwise nothing(empty)
        })
      })

      const userIDs = [currentUser.id,user.id]

      userIDs.forEach( async (id)=> {

      
      const userChatRef = doc(db,"userchats",id)
      const userChatsSnapshot = await getDoc(userChatRef)

      if(userChatsSnapshot.exists()){
        const userChatsData = userChatsSnapshot.data()

        const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId)

        userChatsData.chats[chatIndex].lastMessage = text,
        userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
        userChatsData.chats[chatIndex].isUpdatedAt = Date.now()

        await updateDoc(userChatRef,{
          chats:userChatsData.chats,
        })
      }
      })

    } catch (error) {
      console.log(error);
    }

    setImg({
      file:null,
      url:""
    })

    setText("")
  }

  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="texts">
          <span>{user.username}</span>
          <p>Lorem ipsum dolor si</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      {/* Center */}
      <div className="center">
        { chats?.messages?.map((message)=> (
        <div className={message.senderId === currentUser.id ?  "message own" : "message"} key={message.createdAt}>
          <div className="texts">
            {message.img && <img src={message.img} alt="" />}
            <p>{message.text}</p>
            {/* <span>y{message.createdAt}</span> */}
          </div>
        </div>
      ))}
      {
        img.url && <div className="message own">
          <div className="texts">
            <img src={img.url} alt="" />
          </div>
        </div>
      }
      <div ref={endRef}></div>
      </div>
      {/* Bottom */}
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file" >
          <img src="./img.png" alt=""/>
          </label>
          <input type="file" id="file" style={{display:'none'}} onChange={handleImg} />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input type="text"  placeholder={(isCurrentBlocked || isReceiverBlocked)? "You cannot Send a message ":'Type a message ...'} value={text} onChange={(e)=>setText(e.target.value)}
        disabled={isCurrentBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img src="./emoji.png" alt=""  onClick={()=> setOpen(prev => !prev)}/>
         <div className="picker">
         <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
         </div>
        </div>
        <button className='sendButton' onClick={handleSend} disabled={isCurrentBlocked || isReceiverBlocked}>Send</button>
      </div>
    </div>
  )
}

export default Chat