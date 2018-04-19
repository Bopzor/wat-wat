import React, {Component} from 'react';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove,
} from 'react-sortable-hoc';
import { RemoveIconButton } from '../IconsButton/IconsButton.js';
import { ListSeen, SortIcon,  } from '../SimpleIcons/SimpleIcons.js';
import './MoviesList.css'

const DragHandle = SortableHandle(() => <SortIcon />);

const SortableItem = SortableElement(props => {
  return (
    <li className='item-list'>

      <ListSeen isSeen={props.movie.seen} />
      <span
        className='title-item'
        onClick={() => props.onTitleClick(props.movie)}
      >
        {props.movie.title}
      </span>

      <DragHandle />

      <RemoveIconButton onClick={() => props.removeMovie(props.movie)}/>

    </li>
  );
});

const SortableList = SortableContainer(props => {
  const movies = props.movies;

  return (
    <div className='list'>

      <ul className='movies-list'>
        {movies.map((movie, index) => (
          <SortableItem
            key={`movie-${index}`}
            index={index}
            movie={movie}
            onTitleClick={movie => props.onTitleClick(movie)}
            removeMovie={movie => props.removeMovie(movie)}
          />
        ))}
      </ul>

    </div>
  );
});

class MoviesList extends Component {
  constructor(props) {
    super(props)

    this.state = { movies: this.props.movies };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const movies = { movies: nextProps.movies };

    return movies;
  }

  onSortEnd = ({oldIndex, newIndex}) => {
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
    const movies = this.state.movies;

    return (
      <SortableList
        movies={movies}
        onSortEnd={this.onSortEnd}
        useDragHandle={true}
        lockAxis='y'
        onTitleClick={movie => this.props.onTitleClick(movie)}
        removeMovie={movie => this.props.removeMovie(movie)}
      />
    )
  }
}

export default MoviesList;