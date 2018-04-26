import React, { Component } from 'react';
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import green from 'material-ui/colors/green';
import orange from 'material-ui/colors/orange';
import { LinearProgress } from 'material-ui/Progress';
import MoviesList from './Components/MoviesList/MoviesList.js';
import MovieDetails from './Components/MovieDetails/MovieDetails.js';
import AddMovieInput from './Components/AddMovieInput/AddMovieInput.js';
import {
  getMovies,
  addMovie,
  removeMovie,
  setPlaces,
  addComment,
  removeComment,
  updateComment,
  setMovieSeen,
  getMovieDetails,
} from './actionsToApis.js';
import './reset.css';
import './App.css';


const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: orange,
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      displayMovieId: null,
      filter: {
        seen: false,
        notSeen: false,
      loadingTitle: false,
      },
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
    this.setState({ loadingTitle: true, })
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

            this.setState({ loadingTitle: false, })
          });
      })
      .catch(error => console.error('Error:', error));
  }

  handleFilterSeenClick() {
    const isSeen = this.state.filter.seen;

    this.setState({
      displayMovieId: null,
      filter: {
        seen: !isSeen,
        notSeen: false,
      }
    });
  }

  handleFilterNotSeenClick() {
    const isSeen = this.state.filter.notSeen;

    this.setState({
      displayMovieId: null,
        filter: {
          seen: false,
          notSeen: !isSeen,
      }
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
    return removeMovie(movie)
      .then(() => {
        const movies = this.state.movies.slice();

        movies.splice(movies.findIndex(m => m.id === movie.id), 1);

        this.setState({ movies });
      })
      .catch(error => console.error('Error: ', error))
  }

  handleSendSortPlaces(places) {
    return setPlaces(places)
      .then(movies => {
        this.setState({ movies });
      })
      .catch(error => console.error('Error: ', error));
  }


  handleSetSeenClick(movie) {
    const changedSeen = !movie.seen;

    setMovieSeen(movie, changedSeen)
      .then(movie => {
        const movies = this.state.movies.slice();
        const movieIdx = movies.findIndex(m => m.id === movie.id);

        movies.splice(movieIdx, 1, movie);

        this.setState({ 
          movies,
          filter: {
            seen: false,
            notSeen: false,
          },
         });
      });
  }

  handleSubmitComment(movie, author, comment) {
    return addComment(movie, author, comment)
      .then(movie => {
        const movies = this.state.movies.slice();
        const movieIdx = movies.findIndex(m => m.id === movie.id);

        movies.splice(movieIdx, 1, movie);

        this.setState({ movies });
      });
  }

  handleRemoveComment(movie, comment) {
    return removeComment(movie, comment)
      .then(() => {
        const movies = this.state.movies.slice();
        const movieIdx = movies.findIndex(m => m.id === movie.id);
        const comments = movie.comments.slice();
        const commentIdx = comments.findIndex(c => c.id === comment.id);

        comments.splice(commentIdx, 1);

        const movieUpdated = {...movie, comments};

        movies.splice(movieIdx,1 , movieUpdated);

        this.setState({ movies })
      })
      .catch(error => console.error('Error: ', error));
  }

  handleSubmitEditedComment(movie, comment, newComment) {
    return updateComment(movie, comment, newComment)
      .then(movie => {
        const movies = this.state.movies.slice();
        const movieIdx = movies.findIndex(m => m.id === movie.id);

        movies.splice(movieIdx, 1, movie);

        this.setState({ movies });
      });
  }


  render() {
    const displayMovie = this.state.movies.find(m => m.id === this.state.displayMovieId);
    let moviesDisplay = this.state.movies;

    if (!this.state.filter.seen && this.state.filter.notSeen)
      moviesDisplay = this.state.movies.filter(m => !m.seen);

    else if (this.state.filter.seen && !this.state.filter.notSeen)
      moviesDisplay = this.state.movies.filter(m => m.seen);

    let loadingTitle = <div />;

    if (this.state.loadingTitle)
      loadingTitle = <MuiThemeProvider theme={theme}><LinearProgress color='secondary' /></MuiThemeProvider>
    else
      loadingTitle = <div />;

    return (
      <div className='page'>

        <h1 className='page-title'>Whatcha Watchin?</h1>
        <h3 className='page-title'>(Wat-Wat?)</h3>

        <div className='content-page'>

          <div className='left-side'>

            <AddMovieInput
              onSubmitMovieTitle={title => this.handleSubmitTitle(title)}
              onFilterNotSeenClick={() => this.handleFilterNotSeenClick()}
              onFilterSeenClick={() => this.handleFilterSeenClick()}
              isSeen={this.state.filter}
            />
            {loadingTitle}

            <MoviesList
              movies={moviesDisplay}
              onTitleClick={movie => this.handleTitleClick(movie)}
              removeMovie={movie => this.handleRemoveMovie(movie)}
              sendSortPlaces={places => this.handleSendSortPlaces(places)}
            />

          </div>

          <MovieDetails
            movie={displayMovie}
            setSeen={displayMovie => this.handleSetSeenClick(displayMovie)}
            onSubmitMovieComment={(displayMovie, author, comment)=> this.handleSubmitComment(displayMovie, author, comment)}
            removeComment={(displayMovie, comment)=> this.handleRemoveComment(displayMovie, comment)}
            updateEditedComment={(displayMovie, comment, newComment) => this.handleSubmitEditedComment(displayMovie, comment, newComment)}
          />

        </div>

      </div>
    );
  }
}

export default App;
