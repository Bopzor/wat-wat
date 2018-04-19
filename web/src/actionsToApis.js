/**
 * Requests to Wat-Wat API:
 * Places: {
 *   [id: int]: int,
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
 *
 * getMovieDetails(title: sting) -> Promise<Movie>
 * searchMovieTitle(query: string) -> Promise<string[]>
 */

const BASE_URL = 'http://localhost:4269';
const BASE_API_URL = '/api/movies';
const OMDB_API_URL = 'http://www.omdbapi.com/?apikey=8ce98bc8';

function myFetch(url, opts) {
  opts = opts || {};

  console.log(url, opts);

  return fetch(url, opts)
    .then(res => {
      let promise = null;
      const contentType = res.headers.get('Content-Type');

      if (/^application\/json/.exec(contentType)) {
        promise = res.json();
      } else if (/^text/.exec(contentType)) {
        promise = res.text();
      }

      return promise;
    })
    .catch(error => {
      console.error('Error:', error)
      throw error;
    });
}

/**
 * Requests to Wat-Wat API:
 */

function getMovies() {
  const url = BASE_URL + BASE_API_URL;

  return myFetch(url);
}

function addMovie(movie) {
  const url = BASE_URL + BASE_API_URL;
  const opts = {
    method: 'POST',
    headers: new Headers({
     'Content-Type': 'application/json',
  }),
    body: JSON.stringify(movie),
  };

  return myFetch(url, opts);
}

function removeMovie(movie) {
  const url = BASE_URL + BASE_API_URL + '/' + movie.id
  const opts = {
      method: 'DELETE',
  };

  return myFetch(url, opts);
}

 function setPlaces(places) {
   const url = BASE_URL + BASE_API_URL + '/sort'
   const opts = {
     method: 'POST',
     headers: new Headers({
       'Content-Type': 'application/json',
     }),
     body: JSON.stringify({
       order: places,
     }),
   }

   return myFetch(url, opts);
 }

function setMovieSeen(movie, seen) {
  const url = BASE_URL + BASE_API_URL + '/' + movie.id
  const opts = {
    method: 'PUT',
    headers: new Headers({
     'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      seen: seen,
    }),
  };

  return myFetch(url, opts);
}

function addComment(movie, author, comment) {
  const url = BASE_URL + BASE_API_URL + '/' + movie.id + '/comments';
  const opts = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      comment: comment,
      author: author,
    }),
  };

  return myFetch(url, opts);
}

function removeComment(movie, comment) {
  const url = BASE_URL + BASE_API_URL + '/' + movie.id + '/comments/' + comment.id;
  const opts = {
    method: 'DELETE',
  };

  return myFetch(url, opts);
}

/**
 * Requests to OMDB API:
 */

function getMovieDetails(title) {
  const url = OMDB_API_URL + '&t=' + title;

  return myFetch(url)
    .then(result => {
      if(result.Response !== 'True')
        return null;

      return {
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

function searchMovieTitle(query) {
  const url = OMDB_API_URL + '&s=' + query;

  return myFetch(url)
    .then(result => {
      if(result.Response !== 'True')
        return null;

      return result.Search.map(movie => movie.Title);
    })
    .catch(error => console.error('Error:', error));
}

export {
  getMovies,
  addMovie,
  removeMovie,
  setPlaces,
  addComment,
  removeComment,
  setMovieSeen,
  getMovieDetails,
  searchMovieTitle,
};