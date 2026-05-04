import './Home.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { MovieCard } from '../../components/movie-card'
import { useFetchMovies } from '../../hooks/useFetchMovies'
import type { Movie } from '../../api/movies.ts'

function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [movies, setMovies] = useFetchMovies()
  const [initialMovies, setInitialMovies] = useState<Movie[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const API_KEY = import.meta.env.VITE_API_KEY

  // Sauvegarder les films initiaux quand ils sont chargés
  useEffect(() => {
    if (movies.length > 0 && initialMovies.length === 0) {
      setInitialMovies(movies)
    }
  }, [movies, initialMovies.length])

  const resetToInitial = () => {
    setSearchQuery('')
    setIsSearching(false)
    setMovies(initialMovies)
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) {
      return
    }

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}`
      )
      setMovies(response.data.results)
      setIsSearching(true)
    } catch (error) {
      console.error('Error searching movies:', error)
    }
  }

  return (
    <>
    <div className='home'>
      <h1 onClick={resetToInitial} style={{ cursor: 'pointer' }}>
        Accueil
      </h1>
      <form className="search-container" onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Rechercher un film..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Rechercher
        </button>
      </form>
      {isSearching && searchQuery && (
        <p className="search-result-text">Résultats pour la recherche "{searchQuery}"</p>
      )}
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