import { MOVIE_API_KEY } from './config.js';

const movieForm = document.querySelector('#movie-form');
const movieInput = document.querySelector('#movie-input');
const movieMessage = document.querySelector('#movie-message');
const movieResults = document.querySelector('#movie-results');

const showMovieMessage = (message, isError = false) => {
  movieMessage.textContent = message;
  movieMessage.classList.toggle('error', isError);
};

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

const renderMovies = (movies) => {
  movieResults.innerHTML = movies.map((movie) => {
    const poster = movie.Poster && movie.Poster !== 'N/A'
      ? movie.Poster
      : 'https://placehold.co/400x600/e9efec/6d7a83?text=No+Poster';
    return `
      <article class="movie-card">
        <img src="${escapeHtml(poster)}" alt="Poster for ${escapeHtml(movie.Title)}" loading="lazy">
        <div class="movie-info">
          <h3>${escapeHtml(movie.Title)}</h3>
          <p class="movie-meta">${escapeHtml(movie.Year || 'Release year unavailable')}</p>
          <p class="rating">${movie.imdbRating && movie.imdbRating !== 'N/A' ? `★ ${escapeHtml(movie.imdbRating)} / 10` : 'Rating unavailable'}</p>
          <p class="movie-meta">${escapeHtml(movie.Type || 'Movie')}</p>
        </div>
      </article>`;
  }).join('');
};

movieForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = movieInput.value.trim();
  if (!query) return;

  if (MOVIE_API_KEY === 'YOUR_OMDB_API_KEY') {
    showMovieMessage('Add your OMDb API key in js/config.js to start searching.', true);
    movieResults.innerHTML = '';
    return;
  }

  showMovieMessage('Looking for movies…');
  movieResults.innerHTML = '';
  try {
    const searchUrl = `https://www.omdbapi.com/?apikey=${MOVIE_API_KEY}&s=${encodeURIComponent(query)}&type=movie`;
    const response = await fetch(searchUrl);
    const data = await response.json();
    if (data.Response === 'False') throw new Error(data.Error || 'No movies found. Try another title.');

    const movies = await Promise.all(data.Search.slice(0, 9).map(async (movie) => {
      try {
        const detailResponse = await fetch(`https://www.omdbapi.com/?apikey=${MOVIE_API_KEY}&i=${movie.imdbID}`);
        const details = await detailResponse.json();
        return details.Response === 'True' ? details : movie;
      } catch {
        return movie;
      }
    }));

    renderMovies(movies);
    showMovieMessage(`Found ${movies.length} result${movies.length === 1 ? '' : 's'} for “${query}”.`);
  } catch (error) {
    showMovieMessage(error.message || 'Something went wrong. Please try again.', true);
  }
});
