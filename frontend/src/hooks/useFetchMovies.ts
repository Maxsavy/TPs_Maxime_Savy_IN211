import { useEffect, useState } from 'react'
import axios from 'axios'

const API_KEY = import.meta.env.VITE_API_KEY

interface Movie {
  id: number
  title: string
  release_date: string
  poster_path: string
}

export function useFetchMovies() {
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`

    axios
      .get(url)
      .then(response => {
        setMovies(response.data.results)
      })
      .catch(error => {
        console.error('Error fetching movies:', error)
      })
  }, [])

  return movies
}
