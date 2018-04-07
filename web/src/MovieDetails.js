import React, { Component } from 'react';

class MovieDetails extends Component {
	render() {
		return (
			<div className="movie-details">
				{this.props.movie && this.props.movie.id}
			</div>
		);
	}
}

export default MovieDetails;