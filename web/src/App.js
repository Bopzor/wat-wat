import React, { Component } from 'react';
import MoviesList from './MoviesList.js';
import MovieDetails from './MovieDetails.js';
import AddMovieInput from './AddMovieInput.js';
import request from './Requestes.js'
import './reset.css';
import './App.css';

const BASE_URL = 'http://localhost:4269';
const BASE_API_URL = '/api/movies';
const OMDB_API_URL = 'http://www.omdbapi.com/?apikey=8ce98bc8&t=';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      displayMovieId: null,
    }
  }

  componentDidMount() {
    return fetch(BASE_URL + BASE_API_URL)
      .then(res => res.json())
      .then(movies => {
        console.log('Success: ', movies);
        this.setState({ movies });
      })
      .catch(error => console.error('Error: ', error));
  }

  handleSubmitTitle(title) {
    const urlTitle = OMDB_API_URL + title;

    return request.requestOMDB(urlTitle)
      .then(movie => {
        const opts = {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            title: movie.Title,
            plot: movie.Plot,
            released: movie.Realesed,
            runtime: movie.Runtime,
            director: movie.Director,
            writer: movie.Writer,
            actors: movie.Actors,
            poster: movie.Poster,
          })
        };
      
        return request.requestWatWatApi(BASE_URL + BASE_API_URL, opts)
          .then(movie => {
            const movies = this.state.movies.slice();

            movies.push(movie);

            this.setState({ movies });
          });
      });
  }

  handleTitleClick(movie) {
    if (movie.id === this.state.displayMovieId) { 
      this.setState({
        displayMovieId: null,
      });
    } else {
      this.setState({
        displayMovieId: movie.id,
      });
    }
  }

  handleRemoveMovie(movie) {
    const opts = {
      method: 'DELETE',
    };

    return fetch(BASE_URL + BASE_API_URL + '/' + movie.id, opts)
    .then(() => {
      const movies = this.state.movies.slice();

      movies.splice(movies.findIndex(m => m.id === movie.id), 1);
      
      this.setState({ movies });
    })
    .catch(error => console.error('Error: ', error))
  }

  render() {
    const displayMovie = this.state.movies.find(m => m.id === this.state.displayMovieId);

    return (
      <div className="page">
          <h1 className="page-title">Whatcha Watchin'?</h1>
          <h3 className="page-title">(Wat-Wat?)</h3>
        <div className="content-page">
          <div className="left-side">
            <AddMovieInput onSubmitMovieTitle={(title) => this.handleSubmitTitle(title)}/>
            <MoviesList 
              movies={this.state.movies} 
              onTitleClick={movie => this.handleTitleClick(movie)} 
              removeMovie={movie => this.handleRemoveMovie(movie)}
            />
          </div>
          <MovieDetails movie={displayMovie}/>
        </div>
      </div>
    );
  }
}

export default App;
