import React from 'react';
import { SeenButton } from '../IconsButton/IconsButton.js';
import './MovieInfos.css';

const renderPoster = (poster, title) => {
  if (poster === 'N/A' || poster === 'Unknown') {
    return (
      <img
        className="img"
        src="default_poster.jpg"
        alt={title}
      />
    )
  }

  return (
    <img
      className="img"
      src={poster}
      alt={title}
    />
  )
}

const MovieInfos = (props) => {
  const { movie, setSeenOnClick } = props;
  const { poster, title, plot, runtime, writer, director, actors, released, seen } = movie;

  return (
    <div className="movie-poster-title-seen-infos">

      <div className="poster">
        {renderPoster(poster, title)}
      </div>

      <div className="infos">
        <div className="wrapper-title-seen">
          <div className="title">
            {title}
            <div className="released-runtime">
              <div className="released">
                { released }
              </div>

              <div className="separator">/</div>

              <div className="runtime">
                { runtime }
              </div>
            </div>
          </div>

          <SeenButton
            className="seen-movie-button"
            onClick={movie => setSeenOnClick(movie)}
            isSeen={seen}
            style={{ fontSize: 48 }}
            styleBis={{ fontSize: 48 }}
            color="primary"
            colorBis="disabled"
            icon="done_all"
          />
        </div>

        <div className="wrapper-infos">

          <div className="director">
            <span className="name-info">Director: </span>
            { director }
          </div>

          <div className="writer">
            <span className="name-info">Writer: </span>
            { writer }
          </div>

          <div className="actors">
            <span className="name-info">Actors: </span>
            { actors }
          </div>

          <div>
            <span className="name-info">Plot: </span>
            <div className="movie-plot">{ plot }</div>
          </div>
        </div>

      </div>

    </div>

  );
};

export default MovieInfos;
