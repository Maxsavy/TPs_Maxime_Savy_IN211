import './Home.css'
import { useEffect, useState } from 'react'

import reactLogo from '../../assets/react.svg'
import { MovieCard } from '../../components/movie-card'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_API_KEY

function Home() {
  const [count, setCount] = useState(0)
  const [movies, setMovies] = useState([])
  useEffect(() => {
    console.log('UseEffect')
    axios
      .get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`)
      .then(response => {
        setMovies(
          response.data.results.map((movieObjet: any) => movieObjet.title)
        )
      })
  }, [])

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Mes films</h1>
      <div className="card">
        <input type="text" placeholder="Search movies..." />
        <button onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
      </div>
      {movies.map(title => (
        <MovieCard title={title} />
      ))}
    </>
  )
}

export default Home