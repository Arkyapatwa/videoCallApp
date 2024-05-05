import { useCallback, useState } from "react";

const LobbyPage = () => {
  const [email, setEmail] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleFormSubmit = useCallback((e: any) => {
    e.preventDefault();
    console.log(email, roomId);
  }, [email, roomId]);

  return (
    <div className="lobby-page md:w-1/6 md:flex md:justify-center md:flex-col mx-auto">
      <h1 className="mx-auto">Lobby</h1>
      <form onSubmit={handleFormSubmit} className="md:flex md:flex-col">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email id"
          className="my-2 border border-slate-300 solid"
        />
        <input
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          type="number"
          placeholder="Room id"
          className="my-2 border border-slate-300 solid"
        />
        <button
          type="submit"
          className="my-2 border border-slate-300 w-20 mx-auto"
        >
          Join
        </button>
      </form>
    </div>
  );
};

export default LobbyPage;
