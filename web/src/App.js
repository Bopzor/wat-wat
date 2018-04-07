import React, { Component } from 'react';
import MoviesList from './MoviesList.js';
import MovieDetails from './MovieDetails.js';
import AddMovieInput from './AddMovieInput.js';
import { getMovies, addMovie, removeMovie, getMovieDetails } from './actionsToApis.js';
import './reset.css';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movies: [],
            displayMovieId: null,
        }
    }

    componentDidMount() {
        return getMovies()
            .then(movies => {
                console.log('Success: ', movies);
                this.setState({ movies });
            })
            .catch(error => console.error('Error: ', error));
    }

    handleSubmitTitle(title) {
        return getMovieDetails(title)
            .then(movie => {    
                if (movie === null) {
                    return alert(title + ' not found.')
                }

                return addMovie(movie)
                    .then(movie => {
                        const movies = this.state.movies.slice();

                        movies.push(movie);
                        this.setState({ movies });
                    });
            })
            .catch(error => console.error('Error:', error));
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
        return removeMovie(movie)
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
            <div className='page'>
                <h1 className='page-title'>Whatcha Watchin?</h1>
                <h3 className='page-title'>(Wat-Wat?)</h3>
                <div className='content-page'>
                    <div className='left-side'>
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
