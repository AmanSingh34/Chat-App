import React from 'react'
import "./detail.css"
import { auth, db } from '../../lib/firabase'
import { useUserStore } from '../../lib/userStore'
import { useChatStore } from '../../lib/chatStore'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'

function Detail() {

  const {chatId,user,isCurrentBlocked,isReceiverBlocked,changeBlock} = useChatStore()
  const {currentUser} = useUserStore()

  const handleBlock = async ()=>{
    if(!user) return;

    const userDocRef = doc(db,"users",currentUser.id)

    try {
      await updateDoc(userDocRef,{
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
      })
      changeBlock()
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='detail'>
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user?.username || "User"}</h2>
        <p>Lorem ipsum, dolor sit </p>
      </div>

      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Setting</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./chatimg.jpg " alt="" />
                <span>spring_2024.jpg</span>
              </div>
            <img src="./download.png"  className="icons" alt="" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./chatimg.jpg " alt="" />
                <span>spring_2024.jpg</span>
              </div>
            <img src="./download.png" className="icons"  alt="" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./chatimg.jpg " alt="" />
                <span>spring_2024.jpg</span>
              </div>
            <img src="./download.png" className="icons"  alt="" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./chatimg.jpg " alt="" />
                <span>spring_2024.jpg</span>
              </div>
            <img src="./download.png" className="icons"  alt="" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>
          {
            isCurrentBlocked ? "You are Blocked" : isReceiverBlocked ? "User Blocked" : "Block User"
          }
        </button>
        <button className='logout' onClick={()=>auth.signOut()}>Logout</button>
      </div>
    </div>
  )
}

export default Detail