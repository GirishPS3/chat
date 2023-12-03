import React, { useEffect, useState, useRef } from 'react'
import SocketIo from 'socket.io-client';
import styled from 'styled-components';
import img from './avatar2.png'
let socket;
export const Chat = ({ location }) => {
  const [message, setMessage] = useState('');
  const [id, setId] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [usersList, setUserList] = useState(null);
  const [isClose, setMenu] = useState(true);
  let refToScroll = useRef();
  const handleOnChange = (e) => {
    setMessage(e.target.value);
  }
  const toggle = (e) => {
    setMenu(!isClose);
  }
  const send = () => {
    if (message) {
      socket.emit('message', { message, id });
      setMessage("");
    }
  }

  useEffect(() => {
    socket = SocketIo('https://chatapp-backend-qa96.onrender.com:3001/', { transports: ['websocket'] });
    socket.on('connect', () => {
      console.log('connected');
      setId(socket.id);
    })
    socket.emit('joined', { user: location.state.userName });

    return () => {
      socket.emit('disconnect');
      socket.off();
    }
  }, [])
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      send()
    }
  }
  useEffect(() => {
    socket.on('userList', (data) => {
      setUserList(data.users);
    })
    socket.on('sendMessage', (data) => {
      setMessageList([...messageList, data]);
      refToScroll.current && refToScroll.current.scrollTo(0, refToScroll.current.scrollHeight + 100);
    })
    return () => {
      socket.off();
    }
  }, [messageList])

  return (
    <Container>
      <UserContainer display={isClose}>
        <ChatHeader>
          <h3>Users</h3>
        </ChatHeader>
        {usersList && <ul>
          {Object.entries(usersList).map((user) => (
            user[0] !== id && <li id={user[0]}>
              <div id="userAvatar">
                <img src={img} width="40px" height="auto" />
                <span> </span>
              </div>
              <span>{user[1]}</span>
            </li>
          ))}
        </ul>}
      </UserContainer>
      <ChatBot >
        <ChatHeader>
          <div className="hamburger-icon" id="icon" onClick={toggle}>
            <div className={`icon-1 ${isClose && 'a'}`} ></div>
            <div className={`icon-2 ${isClose && 'c'}`} ></div>
            <div className={`icon-3 ${isClose && 'b'}`} ></div>
            <div className="clear"></div>
          </div>
          <h3>Chat App</h3>
        </ChatHeader>
        <ChatBotContainer ref={refToScroll}>
          {messageList.map(chatData => (

            <p id={chatData.id == id ? 'right' : 'left'}>
              {chatData.id !== id && <span><strong>{chatData.user}&nbsp;</strong></span>} <span>{`${new Date().getHours()} : ${new Date().getMinutes()}`}</span> <br />
              {chatData.message}
            </p>
          ))}
        </ChatBotContainer>

        <InputContainer>
          <input value={message} onChange={handleOnChange} onKeyDown={handleKeyDown} placeholder="Enter Message" />
          <button onClick={send}>Send</button>
        </InputContainer>

      </ChatBot>
    </Container>
  )
}

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #2C2C34;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 400ms cubic-bezier(.84,.06,.52,1.8);
    .icon-1, .icon-2, .icon-3 {
      position: absolute;
      left: 25%;
      top: 50%;
      width: 32px;
      height: 3px;
      background-color: #ffff;
      transition: all 400ms cubic-bezier(.84,.06,.52,1.8);
  }
  
  .icon-1 {
    transform: translateY(-8px);
    animation-delay: 100ms;
  }
  
  .icon-3 {
    transform: translateY(8px);
    animation-delay: 250ms;
  }
  
  .hamburger-icon {
    position: absolute;
    height: 50px;
    width: 50px;
    top: 0;
    left: 0;
    z-index: 1000;
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.2s ease-in-out;
  }
  
  .icon-1.a {
    transform: rotate(40deg);
  }
  .icon-3.b {
    transform: rotate(-40deg);
  }
  .icon-2.c {
    opacity: 0;
  }
  
  .clear {
    clear: both;
  }
  
  @keyframes slideIn {
    0% {
      width: 0%;
       transform: scale(.3);
      opacity: 0;
    }
    
    100% {
      width: 50%;
       transform:scale(1);
      opacity: 1;
    }
  }
`
const UserContainer = styled.div`
    min-width: 20vw;
    background-color: #ffff;
    display: ${props => props.display ? 'flex' : 'none'};
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    min-height: 100%;
    overflow: hidden;
    border-right: 3px solid whitesmoke;
    transition: all 400ms cubic-bezier(.84,.06,.52,1.8);
    ul {
      padding: 0;
      height: 350px;
      width: 100%;
    }
    li {
      padding: 7px;
      display: flex;
      cursor: pointer;
      align-items: center;
      width: 100%;
      font-size: smaller;
      box-shadow: 3px 3px whitesmoke;
      position: relative;
      span {
        padding: 5px;
      }
      
    }
    #userAvatar{
      position: relative;
      margin-right: 5px;
      span {
        position: absolute;
        bottom: 0;
        right: 0;
        border-radius: 50%;
        background: #2a9d8f;
      }
    }
`
const ChatBot = styled.div`
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;

`;
const ChatBotContainer = styled.section`
  color: #ffff;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  background-color: #ffff;
  font-size: smaller;
  transition: all 400ms cubic-bezier(.84,.06,.52,1.8);

  span {
    font-size: x-small;
  }
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    background: #ffff; 
  }
   
  &::-webkit-scrollbar-thumb {
    background: #888; 
  }
   #left{
     background-color: #F5F5F5;
     text-align: left;
     border-radius: 0 10px 10px 0;
     margin-right: auto;
     max-width: 90%;
     color: #333333;
     padding-left: 5px;
   }
   #right{
    background-color: #ED6A5E;
    text-align: right;
    border-radius: 10px 0 0 10px;
    margin-left: auto;
    margin-right: 10px;
    max-width: 90%;
    min-width: 10%;
    padding-right: 5px;

   }
   p{
    padding: 5px;
    margin: 5px 0;
    max-width: 100%;
    position: relative;
  }
  span{
    height: 50px;
  }
`;
const InputContainer = styled.div`
  position: sticky;
  width: 100%;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  background: #ffff;
  input, button {
    outline: none;
    padding: 15px;
  }
  button {
    background: #ED6A5E;
    color: #ffff;
    border: none;
    @media and screen(min-width: 450px){
      min-width: 20%;

    }
  }
  input {
    width: 100%;
    border: solid 3px whitesmoke;

  }
`;
const ChatHeader = styled.div`
  width: 100%;
  text-align: center;
  background: #ED6A5E;
  position: relative;
  color: #ffff;
  h3 {
    margin: 0;
    padding: 15px;
  }
`;