import { useState } from 'react'

import './App.css'

import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import MoviePage from './pages/Movie/MoviePage'

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', textAlign: 'center' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>
          Home
        </Link>
        <Link to="/movies">Movies</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<MoviePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
