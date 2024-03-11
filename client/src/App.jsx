import React, { useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { Container, TextField, Typography, Button, Stack, IconButton } from '@mui/material'
import { MdContentCopy } from "react-icons/md";
import toast, { Toaster } from 'react-hot-toast';
import { RiSendPlaneLine } from "react-icons/ri";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000/"), [])

  const [msgs, setMgs] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketId, setSocketId] = useState("");
  // console.log(msgs)

  const handleCopy = () => {
    navigator.clipboard.writeText(socketId)
    toast.success('Copied')
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
    // setRoom("");
  }

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit('join-room', roomName)
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
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <div className='' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100vh', position: 'relative' }}>
        <Container style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'center', marginTop: '2rem ' }}>
          <Typography variant='h5' component="div" >
            Private Chat Room!
          </Typography>
          <p>Kindly avoid refreshing the page, as doing so result in a change of the user ID</p> <br />
          {/* <p>We don't store any of your data. </p> */}
          <Typography style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Typography variant='subtitle2'>Your User Id :  {socketId}</Typography>
            <IconButton onClick={handleCopy} size='small'>
              <MdContentCopy />
            </IconButton>

          </Typography><br />

          {/* <form onSubmit={joinRoomHandler}>
          <h4 >Join or Create New Room</h4>
          <TextField value={roomName} onChange={(e) => setRoomName(e.target.value)} id="standard-basic" label="Enter Room ID" variant="standard" /> <br />
          <Button type='submit' style={{marginTop:'1rem'}}>Join Room</Button>
          
        </form> */}


          <Stack sx={{ gap: '5' }}>
            <Stack sx={{ maxHeight: '300px', overflowY: 'auto', maxWidth: '500px',gap:2,'@media (max-width: 600px)': { maxWidth: 'auto', maxHeight:'200px' } }}>
              {
                msgs.map((m, i) => (
                  <Typography variant='inherit' key={i} component="div" sx={{ background: '#E8E0DF', padding: 2, borderRadius: 3, display: 'flex', }}>
                    {m}
                  </Typography>
                ))
              }
            </Stack>
          </Stack>

          <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', position: 'absolute', bottom: 0 }}>

            <TextField value={room} onChange={(e) => setRoom(e.target.value)} id="standard-basic" label="User ID" variant="standard" /> <br />
            <Stack sx={{ display: 'flex', }}>
              <TextField value={message} onChange={(e) => setMessage(e.target.value)} id="standard-basic" label="Enter Message" variant="standard" />

              <Button type='submit' variant="contained" size="medium" style={{ margin: '1rem', display: 'flex', gap: '1rem' }}>SEND <RiSendPlaneLine /></Button>
            </Stack>
          </form>

        </Container>
      </div>

    </>
  )
}

export default App
