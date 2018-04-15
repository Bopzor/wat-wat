import React, { Component } from 'react';
import { RemoveIconButton } from './IconsButton.js';
import { SortIcon, ListSeen } from './SimpleIcons.js';

class MoviesList extends Component {
	createMovieTitle(movie) {
		return (
			<div key={movie.id} className='item-list'>
				<ListSeen isSeen={movie.seen} />
				<span 
					className='title-item' 
					onClick={() => this.props.onTitleClick(movie)}>{movie.title}
				</span>
				<SortIcon />
				<RemoveIconButton onClick={() => this.props.removeMovie(movie)}/>
			</div>
		);
	};

	render() {
		return (
			<div className='list'>
				<div className='movies-list'>
					<div>
						{this.props.movies.map(movie => this.createMovieTitle(movie))}
					</div>
				</div>
			</div>
		);
	}
}

export default MoviesList;