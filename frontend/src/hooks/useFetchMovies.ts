import { useEffect, useState } from 'react'
import axios from 'axios'
import type { Movie } from '../api/movies.ts'

const API_KEY = import.meta.env.VITE_API_KEY

export function useFetchMovies(): [Movie[], React.Dispatch<React.SetStateAction<Movie[]>>] {
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

  return [movies, setMovies]
}
