import './movie-card.css'
import { Link } from 'react-router-dom'

interface Movie {
  id: number
  title: string
  release_date: string
  poster_path: string
  vote_average?: number
  overview?: string
}

export const MovieCard = ({ movie }: { movie: Movie }) => {
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A'
  const rating = movie.vote_average ? (movie.vote_average / 2).toFixed(1) : 'N/A'

  return (
    <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
      <div className="movie-card">
        <img src={imageUrl} alt={movie.title} className="movie-poster" />
        <div className="movie-info">
          <h3>{movie.title}</h3>
          <p className="release-date">{releaseYear}</p>
          <div className="movie-rating">
            <span className="star">★</span>
            <span className="rating-value">{rating}</span>
            <span className="rating-max">/5</span>
          </div>
        </div>
      </div>
    </Link>
  )
}