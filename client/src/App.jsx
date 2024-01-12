import React, { useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { Container, TextField, Typography, Button, Stack } from '@mui/material'


const App = () => {
  const socket = useMemo(() => io("http://localhost:3000/"), [])

  const [msgs, setMgs] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketId, setSocketId] = useState("");
  // console.log(msgs)

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
    // setRoom("");
  }
  
  const joinRoomHandler = (e)=>{
    e.preventDefault();
    socket.emit('join-room',roomName)
    setRoomName("")
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id)
      // console.log("User Connected", socket.id)

    })

    socket.on("welcome", (s) => {
      console.log(s)
    })

    socket.on("receive-message", (data) => {
      // console.log(data)
      setMgs((msgs) => [...msgs, data]);
    })
    return () => {
      socket.disconnect();
    }
  }, [])
  return (
    <>
      <Container style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginTop: '7rem ' }}>
        <Typography variant='h5' component="div" >
          Private Chat Room!
      
        </Typography>
        <p>We don't store any of your data. </p><br />


        <Typography>
          <h4>USER ID :  {socketId}</h4> 
          
        </Typography><br />

        <form onSubmit={joinRoomHandler}>
          <h4 >Join or Create New Room</h4>
          <TextField value={roomName} onChange={(e) => setRoomName(e.target.value)} id="standard-basic" label="Enter Room ID" variant="standard" /> <br />
          <Button type='submit' style={{marginTop:'1rem'}}>Join Room</Button>
          
        </form>



        <form onSubmit={handleSubmit}>
          <TextField value={message} onChange={(e) => setMessage(e.target.value)} id="standard-basic" label="Enter Message" variant="standard" /> <br />

          <TextField value={room} onChange={(e) => setRoom(e.target.value)} id="standard-basic" label="Enter Room ID/ User ID" variant="standard" /> <br />

          <Button type='submit' variant="contained" size="small" style={{ margin: '1rem' }}>SEND</Button>
        </form>
        <Stack>
          <Stack>
            {
              msgs.map((m, i) => (
                <Typography key={i} variant='h6' component="div">
                  {m}
                </Typography>
              ))
            }
          </Stack>
        </Stack>
      </Container>

    </>
  )
}

export default App
