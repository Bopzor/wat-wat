import React, { Component } from 'react';
import MovieInfos from '../MovieInfos/MovieInfos.js';
import CommentsZone from '../CommentsZone/CommentsZone.js';
import { LinkIcon } from '../SimpleIcons/SimpleIcons.js';
import './MovieDetails.css';

class MovieDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayMagnets: false,
      movie: null,
      copied: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const nextState = {};

    if (nextProps.movie === null) {
      nextState.movie = null;
      nextState.displayMagnets = false;
    }

    if (nextProps.movie) {
      const displayMagnets = prevState.movie && prevState.movie.id === nextProps.movie.id;
      nextState.movie = nextProps.movie;

      if (displayMagnets && prevState.displayMagnets) {
        nextState.displayMagnets = true;
      }

      if ((displayMagnets && !prevState.displayMagnets) || (!displayMagnets && prevState.displayMagnets)) {
        nextState.displayMagnets = false;
      }

    }

    return nextState;
  }

  setState(state, cb) {
    super.setState(state, () => {
      if (typeof cb === 'function') {
        cb();
      }
    });
  }

  handleClik(e, movie) {
    e.preventDefault();
    return this.props.getMagnet(movie)
      .then(() => this.setState({ displayMagnets: true }));
  }

  createMagnets(magnets) {
    if (magnets.length === 0) {
      return <div className="no-magnet">No link for this movie</div>;
    }

    return magnets.map(magnet => (
      <div key={magnet.hash} className="magnet" >
        <a href={magnet.link}>
          <span className="magnet-link-wrapper">
            <LinkIcon className="magnet-link-icon"/>
            <div className="magnet-infos-wrapper">
              <div className="magnet-quality">{magnet.quality}</div>
              <div className="magnet-size">{magnet.size}</div>
            </div>
          </span>
        </a>
      </div>
    ));
  }

  createMovieDetails(movie, magnets) {
    let magnetsLink = null;
    let magnetsLinkButton = (
      <button
        className="magnet-get-button"
        type="button"
        onClick={(e) => this.handleClik(e, movie)}>
          Get torrent
      </button>
    );

    if (this.state.displayMagnets) {
      magnetsLinkButton = null;
      magnetsLink = this.createMagnets(magnets);
    }

    return (
      <div className="movie-details">
        <div className="wrapper-details">
          <MovieInfos
            movie={movie}
            setSeenOnClick={() => this.props.setSeen(movie)}
          />

          <div className="magnet-wrapper">
            {magnetsLinkButton}
            {magnetsLink}
          </div>
        </div>

        <CommentsZone
          movie={movie}
          onSubmitMovieComment={(author, comment) => this.props.onSubmitMovieComment(movie, author, comment)}
          removeMovieComment={comment => this.props.removeComment(movie, comment)}
          onSubmitUpdateComment={(comment, newComment) => this.props.updateEditedComment(movie, comment, newComment)}
        />

      </div>
    );
  }

  render() {
    if (!this.state.movie) {
      return null;
    }

    return this.createMovieDetails(this.state.movie, this.props.magnets);
  }
}

export default MovieDetails;
