import './Home.css'
import { useState } from 'react'

import reactLogo from '../../assets/react.svg'
import { MovieCard } from '../../components/movie-card'
import { useFetchMovies } from '../../hooks/useFetchMovies'

function Home() {
  const [count, setCount] = useState(0)
  const movies = useFetchMovies()

  return (
    <>
    <div className='home'>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Ma bibliothèque</h1>
      <div className="card">
        <input type="text" placeholder="Search movies..." />
        <button onClick={() => setCount(count + 1)}>
          Rechercher
        </button>
      </div>
      <div className="movies-grid">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
    </>
  )
}

export default Home