import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "../context/SocketProvider";
import peer from "../service/peer";

const Room = () => {
  const socket = useSocket();

  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState<MediaStream | undefined>();
  const [remoteStream, setRemoteStream] = useState<MediaStream | undefined>();

  const handleJoin = useCallback(({ email, id }: { email: any; id: any }) => {
    console.log(`User ${email} joined room ${id}`);
    setRemoteSocketId(id);
  }, []);

  // video calling function
  const handleCall = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer }); // calling to someone in the room so sending the id with offer(my stream)

    setMyStream(stream);
  }, [remoteSocketId, socket]);

  // video call incomming function
  const handleIncommingCall = useCallback(
    async ({ from, offer }: { from: any; offer: any }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setMyStream(stream);
      console.log(`Incomming call from ${from} ${offer}`);
      const answer = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, answer });
    },
    [socket]
  );

  //   add track to peer
  const sendStream = useCallback(() => {
    if (!myStream) return;

    for (const track of myStream.getTracks()) {
      if (!peer.peer) return;
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleAcceptedCall = useCallback(
    ({ from, answer }: { from: any; answer: any }) => {
      peer.setLocalDescription(answer);
      console.log(`Call accepted from ${from} ${answer}`);
      sendStream();
    },
    [sendStream]
  );

  //   nego needed to send the stream
  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { to: remoteSocketId, offer });
  }, [socket, remoteSocketId]);

  useEffect(() => {
    if (!peer.peer) return;
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);

    return () => {
      if (!peer.peer) return;
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleIncommingNego = useCallback(
    async ({ from, offer }: { from: any; offer: any }) => {
      const answer = await peer.getAnswer(offer);
      socket.emit("peer:nego:accepted", { to: from, answer });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(
    async ({ answer }: { answer: any }) => {
      await peer.setLocalDescription(answer);
    },
    []
  );

  useEffect(() => {
    if (!peer.peer) return;
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleJoin);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleAcceptedCall);
    socket.on("incomming:nego:needed", handleIncommingNego);
    socket.on("nego:accepted:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleJoin);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleAcceptedCall);
      socket.off("incomming:nego:needed", handleIncommingNego);
      socket.off("nego:accepted:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleJoin,
    handleIncommingCall,
    handleAcceptedCall,
    handleIncommingNego,
    handleNegoNeedFinal,
  ]);

  return (
    <>
      <h1>Room</h1>
      <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
      {myStream && <button onClick={sendStream}>Send Stream</button>}
      {remoteSocketId && <button onClick={handleCall}>CALL</button>}
      {myStream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={myStream}
          />
        </>
      )}
      {remoteStream && (
        <>
          <h1>Remote Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={remoteStream}
          />
        </>
      )}
    </>
  );
};

export default Room;
