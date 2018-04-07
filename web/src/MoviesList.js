import React, { Component } from 'react';
import RemoveIconButton from './IconsButton.js';

class MoviesList extends Component {


	createMovieTitle(movie) {
		return (
			<div key={movie.id} className="item-list">
				<span 
					className="title-item" 
					onClick={() => this.props.onTitleClick(movie)}>{movie.title}
				</span>
				<RemoveIconButton onClick={() => this.props.removeMovie(movie)}/>
			</div>
		);
	};

	render() {
		return (
			<div className="movies-list">
				<div>
					{this.props.movies.map(movie => this.createMovieTitle(movie))}
				</div>
			</div>
		);
	}
}

export default MoviesList;