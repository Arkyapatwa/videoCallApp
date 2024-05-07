import { Routes, Route } from"react-router-dom"
import LobbyPage from "./pages/lobby"

import './App.css'
import Room from "./pages/room"

function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<LobbyPage />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </div>
    </>
  )
}

export default App
