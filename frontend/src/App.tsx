//import { useState } from 'react'

import './App.css'

import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import MoviePage from './pages/Movie/MoviePage'
import Login from './pages/Login/Login'

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', textAlign: 'center' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>
          Home
        </Link>
        <Link to="/movies" style={{ marginRight: '1rem' }}>
          Favorites
        </Link>
        <Link to="/login" style={{ marginRight: '1rem' }}>
          Login
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<MoviePage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
