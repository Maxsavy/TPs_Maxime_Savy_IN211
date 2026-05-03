import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import './Movie.css'

interface Movie {
  id: number
  title: string
  release_date: string
  poster_path: string
  vote_average: number
  overview: string
  runtime: number
  genres: { id: number; name: string }[]
}

interface Review {
  id: string
  author: string
  content: string
  rating: number
}

interface UserRating {
  userId: string
  movieId: string
  rating: number
  comment: string
  createdAt: string
}

export const MoviePage = () => {
  const { movieId } = useParams()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [userRating, setUserRating] = useState<UserRating | null>(null)
  const [ratingValue, setRatingValue] = useState(0)
  const [commentValue, setCommentValue] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const API_KEY = import.meta.env.VITE_API_KEY
  const BACKEND_URL = import.meta.env.VITE_BACKEND_LOCAL_URL

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail')
    setIsLoggedIn(!!storedEmail)
  }, [])

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
        )
        setMovie(response.data)

        const reviewsResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${API_KEY}`
        )
        setReviews(reviewsResponse.data.results)

        // Fetch user rating if logged in
        if (isLoggedIn) {
          try {
            const ratingResponse = await axios.get(
              `${BACKEND_URL}/ratings/${movieId}`,
              { withCredentials: true }
            )
            if (ratingResponse.data.rating) {
              setUserRating(ratingResponse.data.rating)
              setRatingValue(ratingResponse.data.rating.rating)
              setCommentValue(ratingResponse.data.rating.comment || '')
            }
          } catch (error) {
            // No rating exists yet
          }
        }
      } catch (error) {
        console.error('Error fetching movie details:', error)
      } finally {
        setLoading(false)
      }
    }

    if (movieId) {
      fetchMovieDetails()
    }
  }, [movieId, API_KEY, isLoggedIn, BACKEND_URL])

  const handleDeleteRating = async () => {
    if (!confirm('Supprimer votre avis ?')) return

    try {
      await axios.delete(`${BACKEND_URL}/ratings/${movieId}`, { withCredentials: true })
      setUserRating(null)
      setRatingValue(0)
      setCommentValue('')
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoggedIn) {
      alert('Vous devez être connecté pour noter un film')
      return
    }

    if (ratingValue === 0) {
      alert('Veuillez sélectionner une note')
      return
    }

    setSubmitting(true)

    try {
      if (userRating) {
        // Update existing rating
        await axios.put(
          `${BACKEND_URL}/ratings/${movieId}`,
          {
            rating: ratingValue,
            comment: commentValue,
          },
          { withCredentials: true }
        )
      } else {
        // Create new rating
        await axios.post(
          `${BACKEND_URL}/ratings`,
          {
            movieId: movieId,
            rating: ratingValue,
            comment: commentValue,
            movieTitle: movie?.title,        
            moviePoster: movie?.poster_path,
          },
          { withCredentials: true }
        )
      }

      setUserRating({
        userId: '',
        movieId: movieId || '',
        rating: ratingValue,
        comment: commentValue,
        createdAt: new Date().toISOString(),
      })

      alert('Votre note a été enregistrée !')
    } catch (error: any) {
      console.error('Error submitting rating:', error)
      alert('Erreur lors de l\'enregistrement de votre note')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="movie-page"><p>Chargement...</p></div>
  }

  if (!movie) {
    return <div className="movie-page"><p>Film non trouvé</p></div>
  }

  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  const rating = (movie.vote_average / 2).toFixed(1)

  return (
    <div className="movie-page">
      <Link to="/" className="back-link">← Retour</Link>
      
      <div className="movie-details">
        <div className="movie-poster-section">
          <img src={imageUrl} alt={movie.title} className="movie-poster-large" />
          <div className="movie-rating-large">
            <span className="star">★</span>
            <span className="rating-value">{rating}</span>
            <span className="rating-max">/5</span>
          </div>
        </div>

        <div className="movie-content">
          <h1>{movie.title}</h1>
          
          <div className="movie-meta">
            <span className="release-year">{movie.release_date.split('-')[0]}</span>
            {movie.runtime && <span className="runtime">{movie.runtime} min</span>}
            {movie.genres && movie.genres.length > 0 && (
              <div className="genres">
                {movie.genres.map(genre => (
                  <span key={genre.id} className="genre-tag">{genre.name}</span>
                ))}
              </div>
            )}
          </div>

          <div className="description-section">
            <h2>Synopsis</h2>
            <p className="overview">{movie.overview || 'Aucune description disponible'}</p>
          </div>

          {isLoggedIn && (
            <div className="rating-form-section">
              <h2>{userRating ? 'Modifier votre note' : 'Ajouter votre note'}</h2>
              <form onSubmit={handleSubmitRating} className="rating-form">
                <div className="form-group">
                  <label>Votre note :</label>
                  <div className="star-rating-input">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className={`star-button ${ratingValue >= star ? 'active' : ''}`}
                        onClick={() => setRatingValue(star)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <span className="rating-display">{ratingValue}/5</span>
                </div>

                <div className="form-group">
                  <label htmlFor="comment">Votre commentaire :</label>
                  <textarea
                    id="comment"
                    value={commentValue}
                    onChange={(e) => setCommentValue(e.target.value)}
                    placeholder="Partagez votre avis sur ce film..."
                    rows={4}
                    className="comment-input"
                  />
                </div>

                <button type="submit" disabled={submitting} className="submit-rating-btn">
                  {submitting ? 'Enregistrement...' : 'Enregistrer ma note'}
                </button>
                {userRating && (
                  <button type="button" onClick={handleDeleteRating} className="delete-rating-btn">
                    Supprimer mon avis
                  </button>
                )}
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="reviews-section">
        <h2>Avis des autres utilisateurs ({reviews.length})</h2>
        {reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <h3>{review.author}</h3>
                  {review.rating && (
                    <span className="review-rating">
                      {review.rating}/10
                    </span>
                  )}
                </div>
                <p className="review-content">{review.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun avis disponible</p>
        )}
      </div>
    </div>
  )
}

export default MoviePage
