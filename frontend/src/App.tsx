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
      <nav style={{ padding: '2rem', textAlign: 'center', fontSize: '1.5rem' }}>
        <Link to="/" onClick={handleHomeClick} style={{ marginRight: '2rem' }}>
          Home
        </Link>
        <Link to="/my-notes" style={{ marginRight: '2rem' }}>
          Mes Notes
        </Link>
        <Link to="/login" style={{ marginRight: '2rem' }}>
          Login
        </Link>
      </nav>

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
