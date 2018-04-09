import React, { Component } from 'react';
import MovieDetailsBlockInfos from './MovieDetailsBlockInfos.js'

class MovieDetails extends Component {
	createMovieDetails(movie) {
		return (
			<div className='movie-details'>
				<MovieDetailsBlockInfos
					movie={movie}
					setSeenOnClick={() => this.props.setSeen(movie)}
				/>
				<div className='movie-details-plot'>
					{movie.plot}
				</div>
			</div>				
		)
	};

	render() {
		if (!this.props.movie) {
			return <div className='movie-details' />;
		}

		return this.createMovieDetails(this.props.movie);
	}
}

export default MovieDetails;