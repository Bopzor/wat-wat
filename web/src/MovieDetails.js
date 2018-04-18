import React, { Component } from 'react';
import MovieDetailsBlockInfos from './MovieDetailsBlockInfos.js'
import CommentsZone from './CommentsZone.js';
import './MovieDetails.css'

class MovieDetails extends Component {
	createMovieDetails(movie) {
		return (
			<div className='movie-details'>

				<MovieDetailsBlockInfos
					movie={movie}
					setSeenOnClick={() => this.props.setSeen(movie)}
				/>

				<div className='movie-details-plot'>
					<span>{movie.plot}</span>
				</div>

        <CommentsZone
        	movie={movie}
        	onSubmitMovieComment={(author, comment) => this.props.onSubmitMovieComment(movie, author, comment)}
        	removeMovieComment={(comment) => this.props.removeComment(movie, comment)}
	    	/>

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