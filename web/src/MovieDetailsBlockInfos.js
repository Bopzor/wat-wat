import React from 'react';
import { SeenButton } from './IconsButton.js';

const MovieDetailsBlockInfos = (props) => {
	return (
		<div className='movie-details-block-infos'>

			<div className='movie-details-poster'>
				<img
				src={props.movie.poster}
				alt={props.movie.title}
				/>
			</div>

			<div className='movie-details-with-title-infos'>

				<div className='movie-details-title'>
					{props.movie.title}
				</div>

				<div className='movie-details-infos'>

					<div className='movie-details-released'>
						<div className='movie-details-name-info'>Released: </div>
						{props.movie.released}
					</div>

					<div className='movie-details-runtime'>
						<div className='movie-details-name-info'>Runtime: </div>
						{props.movie.runtime}
					</div>

					<div className='movie-details-director'>
						<div className='movie-details-name-info'>Director: </div>
						{props.movie.director}
					</div>

					<div className='movie-details-writer'>
						<div className='movie-details-name-info'>Writer: </div>
						{props.movie.writer}
					</div>

					<div className='movie-details-actors'>
						<div className='movie-details-name-info'>Actors: </div>
						{props.movie.actors}
					</div>

				</div>

			</div>

			<SeenButton
				onClick={movie => props.setSeenOnClick(movie)}
				isSeen={props.movie.seen}
			/>

		</div>
	)
}

export default MovieDetailsBlockInfos;