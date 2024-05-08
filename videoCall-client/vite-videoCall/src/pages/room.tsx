import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../context/SocketProvider";
import peer from "../service/peer";

const Room = () => {
  const socket = useSocket();

  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState<any>(null);

  const handleJoin = useCallback(({ email, id } : { email: any; id: any; }) => {
    console.log(`User ${email} joined room ${id}`);
    setRemoteSocketId(id);
  }, []);

  // video calling function
  const handleCall = useCallback( async () => {  
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer }); // calling to someone in the room so sending the id with offer(my stream)

    setMyStream(stream);
  }, [remoteSocketId, socket]);

  // video call incomming function
  const handleIncommingCall = useCallback(({from, offer} : {from: any; offer: any;}) => { 
      console.log(`Incomming call from ${from} ${offer}`);
  }, [])


  useEffect(() => {
    socket.on("user:joined", handleJoin);
    socket.on("incomming:call", handleIncommingCall);

    return () => {
      socket.off("user:joined", handleJoin);
      socket.off("incomming:call", handleIncommingCall);
    };
  }, [socket, handleJoin, handleIncommingCall]);

  return (
    <>
      <h1>Room</h1>
      <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
      {remoteSocketId && <button onClick={handleCall}>CALL</button>}
      {myStream && (
        <>
          <ReactPlayer playing muted height="100px" width="200px" url={myStream} />
        </>
      )}
    </>
  );
};

export default Room;
