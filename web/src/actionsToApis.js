/**
 * Requests to Wat-Wat API:
 * Places: {
 *    [id: int]: int,
 * }
 *
 * Movie: {
 *    id: number,
 *    createdAt: Date,
 *    title: string,
 *    plot: string,
 *    release: string,
 *    runtime: string,
 *    director: string,
 *    writers: string,
 *    actors: string,
 *    poster: string,
 *    imdb: string,
 * }
 *
 * Comment: {
 *    comment: string,
 *    author: string,
 *    createdAt: Date,
 *    uptadedAt: Date,
 * }
 *
 * getMovies() -> Promise<Movie[]>
 * addMovie(movie: Movie) -> Promise<Movie>
 * removeMovie(movie: Movie) -> Promise
 * setPlaces(places: Places) -> Promise<Movie[]>
 * setMovieSeen(movie: Movie, seen: boolean) -> Promise<Movie>
 * addComment(movie: Movie, author: string, comment: string) -> Promise<Movie>
 * removeComment(movie: Movie, comment: Comment) -> Promise
 * updateComment(movie: Movie, comment: Comment, newComment: string) -> Promise<Movie>
 *
 * Requests to OMDB API:
 * searchedMovie: {
 *    title: string,
 *    year: string,
 *    poster: string,
 * }
 *
 * getMovieDetails(title: sting) -> Promise<Movie>
 * searchMovieTitle(query: string) -> Promise<searchedMovie[]>
 *
 * Magnet: string
 *
 * Request to YTS API:
 * getMagnet(imdbId: string) -> Promise<Magnet[]>
 *
 */

/* eslint-disable-next-line no-undef */
const BASE_URL = process.env.REACT_APP_API_URL;
const BASE_API_URL = '/api/movies';
const API_URL = `${BASE_URL}${BASE_API_URL}`;

/* eslint-disable-next-line no-undef */
const OMDB_API_URL = `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}`;
const YTS_API_URL = 'https://yts.am/api/v2/list_movies.json?query_term=';
const ytsClients = [
  'tracker.coppersurfer.tk:6969',
  'open.demonii.com:1337',
  'tracker.publicbt.com:80',
  '9.rarbg.me:2710/announce',
  'p4p.arenabg.com:1337',
  'tracker.internetwarriors.net:1337',
  'torrent.gresille.org:80/announce',
  'tracker.openbittorrent.com:80',
];

function myFetch(url, opts) {
  opts = opts || {};

  return fetch(url, opts)
    .then(res => {
      const contentType = res.headers.get('Content-Type');

      if (/^application\/json/.exec(contentType)) {
        return res.json();
      } else if (/^text/.exec(contentType)) {
        return res.text();
      }

    })
    .catch(error => {
      console.error('Error:', error);
      throw error;
    });
}

function formatTimestamp(movie) {
  movie.createdAt = new Date(Date.parse(movie.createdAt));
  movie.updatedAt = new Date(Date.parse(movie.updatedAt));

  for (let i = 0; i < movie.comments.length; i++) {
    movie.comments[i].createdAt = new Date(Date.parse(movie.comments[i].createdAt));
    movie.comments[i].updatedAt = new Date(Date.parse(movie.comments[i].updatedAt));
  }
}

function createMagnet(torrent) {
  let magnet = `magnet:?xt=urn:btih:${torrent.hash}`;
  magnet += `&dn=${torrent.url}`;
  magnet += `&tr=udp://${ytsClients.join('&tr=udp://')}`;

  return magnet;
}

/**
 * Requests to Wat-Wat API:
 */

export function getMovies() {
  const url = API_URL;

  return myFetch(url)
    .then(movies => {
      for (let i = 0; i < movies.length; i++) {
        formatTimestamp(movies[i]);
      }

      return movies;
    });
}

export function addMovie(movie) {
  const url = API_URL;
  const opts = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(movie),
  };

  return myFetch(url, opts)
    .then(movie => {
      formatTimestamp(movie);

      return movie;
    });
}

export function removeMovie(movie) {
  const url = `${API_URL}/${movie.id}`;
  const opts = {
    method: 'DELETE',
  };

  return myFetch(url, opts);
}

export function setPlaces(places) {
  const url = `${API_URL}/sort`;
  const opts = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      order: places,
    }),
  };

  return myFetch(url, opts)
    .then(movies => {
      for (let i = 0; i < movies.length; i++) {
        formatTimestamp(movies[i]);
      }

      return movies;
    });
}

export function setMovieSeen(movie, seen) {
  const url = `${API_URL}/${movie.id}`;
  const opts = {
    method: 'PUT',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      seen,
    }),
  };

  return myFetch(url, opts)
    .then(movie => {
      formatTimestamp(movie);

      return movie;
    });
}

export function addComment(movie, author, comment) {
  const url = `${API_URL}/${movie.id}/comments`;
  const opts = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      comment,
      author,
    }),
  };

  return myFetch(url, opts)
    .then(movie => {
      formatTimestamp(movie);

      return movie;
    });
}

export function removeComment(movie, comment) {
  const url = `${API_URL}/${movie.id}/comments/${comment.id}`;
  const opts = {
    method: 'DELETE',
  };

  return myFetch(url, opts);
}

export function updateComment(movie, comment, newComment) {
  const url = `${API_URL}/${movie.id}/comments/${comment.id}`;
  const opts = {
    method: 'PUT',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      comment: newComment,
      author: comment.author,
    }),
  };

  return myFetch(url, opts)
    .then(movie => {
      formatTimestamp(movie);

      return movie;
    });
}

/**
 * Requests to OMDB API:
 */

export function getMovieDetails(title) {
  const url = `${OMDB_API_URL}&t=${title}`;

  return myFetch(url)
    .then(result => {
      if (result.Response !== 'True') {
        return null;
      }

      return {
        imdbId: result.imdbID,
        title: result.Title,
        plot: result.Plot,
        released: result.Released,
        runtime: result.Runtime,
        director: result.Director,
        writer: result.Writer,
        actors: result.Actors,
        poster: result.Poster,
      };
    });
}

export function searchMovieTitle(query) {
  const url = `${OMDB_API_URL}&s=${query}`;

  return myFetch(url)
    .then(result => {
      if (result.Response !== 'True') {
        return [];
      }

      return result.Search.map(searchedMovie => ({
        title: searchedMovie.Title,
        year: searchedMovie.Year,
        poster: searchedMovie.Poster,
      }));
    })
    .catch(error => console.error('Error:', error));
}

/**
 * Requests to YTS API:
 */

export function getMagnet(imdbId) {
  const url = `${YTS_API_URL}${imdbId}`;

  return myFetch(url)
    .then(result => {
      if (result.data.movie_count <= 0) {
        return null;
      }

      return result.data.movies[0].torrents.map(torrent => ({
        link: createMagnet(torrent),
        size: torrent.size,
        quality: torrent.quality,
        hash: torrent.hash,
      }));
    });
}
