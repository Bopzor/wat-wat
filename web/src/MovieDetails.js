import React, { Component } from 'react';

class MovieDetails extends Component {
	createMovieDetails(movie) {
		return (
			<div className='movie-details'>
				<img 
					className='movie-poster'
					src={movie && movie.poster}
					alt={movie && movie.title}
				/>
				<div className='movie-title'>
					{movie && movie.title}
				</div>
				<div className='movie-realesed'>
					{movie && movie.realesed}
				</div>
				<div className='movie-runtime'>
					{movie && movie.runtime}
				</div>
				<div className='movie-director'>
					{movie && movie.director}
				</div>
			</div>				
		)
	};

	render() {
		return (
			this.createMovieDetails(this.props.movie)
		);
	}
}

export default MovieDetails;