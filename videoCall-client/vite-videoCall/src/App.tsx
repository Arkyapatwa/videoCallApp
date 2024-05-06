import { Routes, Route } from"react-router-dom"
import LobbyPage from "./pages/lobby"

import './App.css'

function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<LobbyPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App