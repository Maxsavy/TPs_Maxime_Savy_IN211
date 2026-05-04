import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './MyNotes.css'

interface UserRating {
  userId: string
  movieId: string
  rating: number
  comment: string
  createdAt: string
}

interface Movie {
  id: number
  title: string
  release_date: string
  poster_path: string
}

interface RatingWithMovie extends UserRating {
  movieDetails?: Movie
}

export const MyNotes = () => {
  const [ratings, setRatings] = useState<RatingWithMovie[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const API_KEY = import.meta.env.VITE_API_KEY

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail')
    setIsLoggedIn(!!storedEmail)

    if (storedEmail) {
      fetchMyRatings()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchMyRatings = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/ratings/user/me`,
        { withCredentials: true }
      )
      
      const ratingsData = response.data.ratings || []
      
      // Fetch movie details for each rating
      const ratingsWithMovies = await Promise.all(
        ratingsData.map(async (rating: UserRating) => {
          try {
            const movieResponse = await axios.get(
              `https://api.themoviedb.org/3/movie/${rating.movieId}?api_key=${API_KEY}`
            )
            return {
              ...rating,
              movieDetails: movieResponse.data
            }
          } catch (error) {
            return rating
          }
        })
      )
      
      setRatings(ratingsWithMovies)
    } catch (error) {
      console.error('Error fetching ratings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="my-notes">
        <h1>Mes Notes</h1>
        <div className="not-logged-in">
          <p>Connectez-vous pour voir vos notes et vos films favoris</p>
          <Link to="/login" className="login-link">
            Se connecter
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="my-notes">
        <h1>Mes Notes</h1>
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="my-notes">
      <h1>Mes Notes</h1>
      
      {ratings.length === 0 ? (
        <div className="empty-state">
          <p>Vous n'avez pas encore noté de films</p>
          <Link to="/" className="browse-link">
            Découvrir des films
          </Link>
        </div>
      ) : (
        <div className="notes-grid">
          {ratings.map((rating) => (
            <div key={rating.movieId} className="note-card">
              {rating.movieDetails?.poster_path && (
                <img 
                  src={`https://image.tmdb.org/t/p/w300${rating.movieDetails.poster_path}`}
                  alt={rating.movieDetails?.title}
                  className="note-poster"
                />
              )}
              
              <div className="rating-badge">
                <span className="star">★</span>
                <span className="rating-value">{rating.rating}</span>
                <span>/5</span>
              </div>

              <div className="note-content">
                <h3>{rating.movieDetails?.title || rating.movieId}</h3>
                <p className="note-comment">{rating.comment || 'Pas de commentaire'}</p>
                <p className="note-date">
                  {new Date(rating.createdAt).toLocaleDateString('fr-FR')}
                </p>

                <Link
                  to={`/movie/${rating.movieId}`}
                  className="view-movie-link"
                >
                  Voir mon avis →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyNotes

