//import { useState } from 'react'
import { useState } from 'react'

import './App.css'

import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import MoviePage from './pages/Movie/MoviePage'
import Login from './pages/Login/Login'
import MyNotes from './pages/MyNotes/MyNotes'

function App() {
  const [homeKey, setHomeKey] = useState(0)

  const handleHomeClick = () => {
    setHomeKey(prev => prev + 1)
  }

  return (
<BrowserRouter>
  <header className="app-header">
    <span className="app-logo">RATE MY MOVIE</span>
    <nav className="app-nav">
      <Link to="/" onClick={handleHomeClick}>Home</Link>
      <Link to="/my-notes">Mes Notes</Link>
      <Link to="/login">Login</Link>
    </nav>
  </header>

  <Routes>
    <Route path="/" element={<Home key={homeKey} />} />
    <Route path="/movie/:movieId" element={<MoviePage />} />
    <Route path="/my-notes" element={<MyNotes />} />
    <Route path="/login" element={<Login />} />
  </Routes>
</BrowserRouter>
  )
}

export default App
