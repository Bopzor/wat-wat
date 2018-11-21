import React, { Component } from 'react';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc';
import ScrollIntoViewIfNeeded from 'react-scroll-into-view-if-needed';
import { GenericButton } from '../IconsButton/IconsButton.js';
import { ListSeen, SortIcon } from '../SimpleIcons/SimpleIcons.js';
import './MoviesList.css';

const DragHandle = SortableHandle(() => <SortIcon />);

class MovieItem extends Component {
  render() {
    let activeMovie = false;

    if (this.props.active === this.props.movie.imdbId){
      activeMovie = true;
    }

    let selectedTitle = 'unselected-title';

    if (this.props.displayMovie && this.props.displayMovie.imdbId === this.props.movie.imdbId) {
      selectedTitle = 'selected-title';
    } else if (this.props.displayMovie === null) {
      selectedTitle = 'no-title-selected';
    }

    return (
      <ScrollIntoViewIfNeeded
        className={selectedTitle + ' ' + (activeMovie ? 'wrapper-scroll-active' : 'wrapper-scroll-inactive')}
        active={activeMovie}
      >
        <li className="item-list">

          <ListSeen isSeen={this.props.movie.seen} />
          <span
            className="title-item"
            onClick={() => this.props.onTitleClick(this.props.movie)}
          >
            {this.props.movie.title}
          </span>

          <DragHandle />

          <GenericButton
            className="remove-button"
            onClick={() => this.props.removeMovie(this.props.movie)}
            style={{ fontSize: 24 }}
            color="secondary"
            icon="remove_circle"
          />

        </li>
      </ScrollIntoViewIfNeeded>
    );
  }
}

const SortableMovieItem = SortableElement(MovieItem);

class MoviesSortableList extends Component {
  render() {
    const { movies, onTitleClick, removeMovie, active, displayMovie } = this.props;

    return (
      <div className="list">

        <ul className="movies-list">
          {movies.map((movie, index) => (
            <SortableMovieItem
              key={`movie-${index}`}
              index={index}
              movie={movie}
              onTitleClick={movie => onTitleClick(movie)}
              removeMovie={movie => removeMovie(movie)}
              active={active}
              displayMovie={displayMovie}
            />
          ))}
        </ul>

      </div>
    );
  }
}

const SortableList = SortableContainer(MoviesSortableList);

class MoviesList extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static getDerivedStateFromProps(nextProps) {
    const movies = { movies: nextProps.movies };

    return movies;
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const movies = this.state.movies.slice();
    const prev = movies[oldIndex].place;
    const newMoviesOrder = arrayMove(movies, oldIndex, newIndex);
    let nxt = null;

    if (oldIndex !== newIndex) {
      nxt = movies[newIndex].place;

    } else {
      return;
    }

    const places = {
      prev,
      nxt,
    };

    this.setState({
      movies: newMoviesOrder,
    });

    this.props.sendSortPlaces(places);
  };

  render() {
    const { movies } = this.state;

    return (
      <SortableList
        movies={movies}
        onSortEnd={this.onSortEnd}
        useDragHandle={true}
        lockAxis="y"
        onTitleClick={movie => this.props.onTitleClick(movie)}
        removeMovie={movie => this.props.removeMovie(movie)}
        active={this.props.active}
        displayMovie={this.props.displayMovie}
      />
    );
  }
}

export default MoviesList;
