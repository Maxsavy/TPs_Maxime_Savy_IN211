import './movie-card.css'

interface Movie {
  id: number
  title: string
  release_date: string
  poster_path: string
}

export const MovieCard = ({ movie }: { movie: Movie }) => {
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A'

  return (
    <div className="movie-card">
      <img src={imageUrl} alt={movie.title} className="movie-poster" />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="release-date">{releaseYear}</p>
      </div>
    </div>
  )
}