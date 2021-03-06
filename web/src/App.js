import React, { Component } from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import theme from './theme.js';
import MoviesList from './Components/MoviesList/MoviesList.js';
import MovieDetails from './Components/MovieDetails/MovieDetails.js';
import AddMovieInput from './Components/AddMovieInput/AddMovieInput.js';
import SnackBar from './Components/SnackBar/SnackBar.js';
import * as actions from './actionsToApis';
import './App.css';

class App extends Component {
  state = {
    movies: [],
    displayMovieId: null,
    filter: {
      seen: false,
      notSeen: false,
    },
    loadingTitle: false,
    magnets: [],
    open: false,
    message: '',
    active: '',
    title: null,
  };

  componentDidMount() {
    return actions.getMovies()
      .then(movies => {
        this.setState({
          movies,
        });
      })
      .catch(error => console.error('Error: ', error));
  }

  findMovieIndex(movie) {
    return this.state.movies.findIndex(m => m.id === movie.id);
  }

  handleSnackBarClose(event, reason){
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      open: false,
      message: '',
      title: null,
      active: '',
    });
  }

  handleSubmitTitle(title) {
    this.setState({ loadingTitle: true });


    return actions.getMovieDetails(title)
      .then(movie => {
        if (movie === null) {
          return this.setState({
            message :`${title} not found.`,
            title,
            open: true,
          });
        }

        const findIndex = this.state.movies.findIndex(m => m.imdbId === movie.imdbId);

        if (findIndex !== -1) {
          return this.setState({
            message :`${movie.title} is already in the list.`,
            open: true,
            active: movie.imdbId,
          });
        }

        return actions.addMovie(movie)
          .then(movie => {
            const movies = this.state.movies.slice();

            movies.splice(0, 0, movie);

            this.setState({
              movies,
              filter: {
                seen: false,
                notSeen: false,
              },
            });
          });
      })
      .catch(error => console.error('Error:', error))
      .then(() => this.setState({ loadingTitle: false }));
  }

  handleAddItAnyway(title) {
    const movie = { title };

    this.handleSnackBarClose()

    return actions.addMovie(movie)
      .then(movie => {
        const movies = this.state.movies.slice();

        movies.splice(0, 0, movie);

        this.setState({
          movies,
          filter: {
            seen: false,
            notSeen: false,
          },
        });
      });
  }

  handleFilterSeenClick() {
    const isSeen = this.state.filter.seen;

    this.setState({
      displayMovieId: null,
      filter: {
        seen: !isSeen,
        notSeen: false,
      },
    });
  }

  handleFilterNotSeenClick() {
    const isNotSeen = this.state.filter.notSeen;

    this.setState({
      displayMovieId: null,
      filter: {
        seen: false,
        notSeen: !isNotSeen,
      },
    });
  }

  handleTitleClick(movie) {
    this.setState({
      displayMovieId: movie.id === this.state.displayMovieId ? null : movie.id,
      magnets: [],
    });
  }

  handleRemoveMovie(movie) {
    return actions.removeMovie(movie)
      .then(() => {
        const movies = this.state.movies.slice();

        movies.splice(this.findMovieIndex(movie), 1);

        this.setState({
          movies,
          displayMovieId: null,
        });
      })
      .catch(error => console.error('Error: ', error));
  }

  handleSortingMovies(places) {
    return actions.setPlaces(places)
      .then(movies =>
        this.setState({ movies })
      )
      .catch(error => console.error('Error: ', error));
  }

  handleSetSeenClick(movie) {
    const changedSeen = !movie.seen;

    return actions.setMovieSeen(movie, changedSeen)
      .then(movie => {
        const movies = this.state.movies.slice();
        const movieIdx = this.findMovieIndex(movie);

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

  handleGetMagnet(movie) {
    return actions.getMagnet(movie.imdbId)
      .then(magnets => {
        if (magnets && magnets.length > 0) {
          return new Promise(resolve => {
            this.setState({ magnets }, resolve);
          });
        }
      });
  }

  handleSubmitComment(movie, author, comment) {
    return actions.addComment(movie, author, comment)
      .then(movie => {
        const movies = this.state.movies.slice();
        const movieIdx = this.findMovieIndex(movie);

        movies.splice(movieIdx, 1, movie);

        this.setState({ movies });
      });
  }

  handleRemoveComment(movie, comment) {
    return actions.removeComment(movie, comment)
      .then(() => {
        const movies = this.state.movies.slice();
        const movieIdx = this.findMovieIndex(movie);
        const comments = movie.comments.slice();
        const commentIdx = comments.findIndex(com => com.id === comment.id);

        comments.splice(commentIdx, 1);

        const movieUpdated = { ...movie, comments };

        movies.splice(movieIdx, 1, movieUpdated);

        this.setState({ movies });
      })
      .catch(error => console.error('Error: ', error));
  }

  handleSubmitEditedComment(movie, comment, newComment) {
    return actions.updateComment(movie, comment, newComment)
      .then(movie => {
        const movies = this.state.movies.slice();
        const movieIdx = this.findMovieIndex(movie);

        movies.splice(movieIdx, 1, movie);

        this.setState({ movies });
      });
  }

  render() {
    const {
      movies,
      displayMovieId,
      filter,
      loadingTitle,
      magnets,
      open,
      message,
      active,
      title,
    } = this.state;

    const displayMovie = movies.find(m => m.id === displayMovieId) || null;
    let moviesDisplay = movies;

    if (!filter.seen && filter.notSeen) {
      moviesDisplay = movies.filter(m => !m.seen);
    } else if (filter.seen && !filter.notSeen) {
      moviesDisplay = movies.filter(m => m.seen);
    }

    return (
      <div className="page">

        <SnackBar
          open={open}
          onClose={() => this.handleSnackBarClose()}
          onAdd={(title) => this.handleAddItAnyway(title)}
          message={message}
          title={title}
        />

        <div className="page-title">
          <h1>Whatcha Watchin?</h1>
          <h3>(Wat-Wat?)</h3>
        </div>

        <div className="content-page">

          <div className="left-side">

            <AddMovieInput
              onSubmitMovieTitle={title => this.handleSubmitTitle(title)}
              onFilterNotSeenClick={() => this.handleFilterNotSeenClick()}
              onFilterSeenClick={() => this.handleFilterSeenClick()}
              isSeen={this.state.filter}
            />
            {loadingTitle && <LinearProgress color="secondary" />}

            <MoviesList
              movies={moviesDisplay}
              setSeen={displayMovie => this.handleSetSeenClick(displayMovie)}
              onTitleClick={movie => this.handleTitleClick(movie)}
              removeMovie={movie => this.handleRemoveMovie(movie)}
              sendSortPlaces={places => this.handleSortingMovies(places)}
              active={active}
              displayMovie={displayMovie}
            />

          </div>

          <div className={displayMovieId === null ? 'right-side-hidden' : 'right-side'}>

            <MovieDetails
              movie={displayMovie}
              magnets={magnets}
              setSeen={displayMovie => this.handleSetSeenClick(displayMovie)}
              getMagnet={displayMovie => this.handleGetMagnet(displayMovie)}
              onSubmitMovieComment={
                (displayMovie, author, comment) =>
                  this.handleSubmitComment(displayMovie, author, comment)
              }
              removeComment={(displayMovie, comment) => this.handleRemoveComment(displayMovie, comment)}
              updateEditedComment={
                (displayMovie, comment, newComment) =>
                  this.handleSubmitEditedComment(displayMovie, comment, newComment)
              }
            />

          </div>

        </div>

      </div>
    );
  }
}

export default () => <MuiThemeProvider theme={theme}><App /></MuiThemeProvider>;
