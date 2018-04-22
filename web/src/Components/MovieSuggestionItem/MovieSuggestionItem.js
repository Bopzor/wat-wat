import React from 'react';
import './MovieSuggestionItem.css'

const MovieHighLightedSuggestionItem = movie => {
  return (
    <div className='suggestion'>
      <div className='suggestion-title'>
        {movie.Title}
      </div>
      <div className='poster-year'>
        <div className='suggestion-poster'>
         <img
            src={movie.poster}
            alt={movie.title}
          />
        </div>
        <div className='suggestion-year'>
          {movie.year}
        </div>
      </div>
    </div>
  );
};

const MovieSuggestionItem = movie => {
  return (
    <div>
      {movie.title}
    </div>
  );
};

export {
  MovieHighLightedSuggestionItem,
  MovieSuggestionItem,
}