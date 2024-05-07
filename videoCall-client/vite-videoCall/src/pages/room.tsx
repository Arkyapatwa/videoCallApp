import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../context/SocketProvider";

const Room = () => {
  const socket = useSocket();

  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);

  const handleJoin = useCallback(({ email, id }) => {
    console.log(`User ${email} joined room ${id}`);
    setRemoteSocketId(id);
  }, []);

  const handleCall = useCallback( async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setMyStream(stream);
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleJoin);

    return () => {
      socket.off("user:joined", handleJoin);
    };
  }, [socket, handleJoin]);

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
