import React from 'react';
import { SeenButton } from '../IconsButton/IconsButton.js';
import './MovieDetailsBlockInfos.css';

const MovieDetailsBlockInfos = (props) => {
  return (
    <div className='movie-details-block-infos'>

      <div className='poster'>
        <img
          className="img"
          src={props.movie.poster}
          alt={props.movie.title}
        />
      </div>

      <div className='with-title-infos'>

        <div className='title'>
          {props.movie.title}
        </div>

        <div className='infos'>

          <div className='released'>
            <div className='name-info'>Released: </div>
            {props.movie.released}
          </div>

          <div className='runtime'>
            <div className='name-info'>Runtime: </div>
            {props.movie.runtime}
          </div>

          <div className='director'>
            <div className='name-info'>Director: </div>
            {props.movie.director}
          </div>

          <div className='writer'>
            <div className='name-info'>Writer: </div>
            {props.movie.writer}
          </div>

          <div className='actors'>
            <div className='name-info'>Actors: </div>
            {props.movie.actors}
          </div>

        </div>

        <SeenButton
          className="seen-movie-button"
          onClick={movie => props.setSeenOnClick(movie)}
          isSeen={props.movie.seen}
          style={{ fontSize: 48 }}
          styleBis={{ fontSize: 48 }}
          color="primary"
          colorBis="disabled"
          icon="done_all"
        />
      </div>

    </div>
  );
};

export default MovieDetailsBlockInfos;
