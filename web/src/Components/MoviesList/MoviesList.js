import React, { Component } from 'react';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc';
import { GenericButton } from '../IconsButton/IconsButton.js';
import { ListSeen, SortIcon } from '../SimpleIcons/SimpleIcons.js';
import './MoviesList.css';

const DragHandle = SortableHandle(() => <SortIcon />);

class MovieItem extends Component {
  render() {
    return (
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
    );
  }
}

const SortableMovieItem = SortableElement(MovieItem);

class MoviesSortableList extends Component {
  render() {
    const { movies, onTitleClick, removeMovie } = this.props;

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
    const newMoviesOrder = arrayMove(movies, oldIndex, newIndex);
    const places = {};

    this.setState({
      movies: newMoviesOrder,
    });

    for (let i = 0; i < newMoviesOrder.length; i++)
      places[newMoviesOrder[i].id] = i + 1;

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
      />
    );
  }
}

export default MoviesList;
