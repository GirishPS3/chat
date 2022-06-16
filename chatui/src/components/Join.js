import React, { useState } from 'react'
import { Redirect } from 'react-router';
import styled from 'styled-components';

export const Join = () => {
  const [userName, setuserName] = useState('');
  const [redirect, setRedirect] = useState('');
  const handleOnChange = (e) => {
    setuserName(e.target.value)
  }
  const joinRoom = () => {
    userName && setRedirect(true);
  }
  return (
    <Container>
      {redirect && <Redirect to={{ pathname: '/chat', state: { userName } }} />}
      <div>
        <h2>Join Chat Room</h2>
        <input id="name" value={userName} onChange={handleOnChange} placeholder="Enter your Name" />
        <button onClick={joinRoom}>Join</button>
      </div>
    </Container>
  )
}

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #2C2C34;
  display: flex;
  flex-direction: column;
  color: #ffff;
  align-items: center;
  justify-content: center;
  div {
    min-width: 30%;
    max-width: 300px;
    input, button {
      padding: 10px;
      outline: none;
      border: none;
      width: -webkit-fill-available;
      display: block;
      margin: 10px 0;
      border-radius: 5px;
    }
    button {
      background-color: #ED6A5E;
      color: #ffff;
    }
    h2{
      padding-bottom: 10px;
      border-bottom: solid 2px #ffff;
    }
  }
`;