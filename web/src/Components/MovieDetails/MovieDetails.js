import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import MovieDetailsBlockInfos from '../MovieDetailsBlockInfos/MovieDetailsBlockInfos.js';
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
      console.log('setState', JSON.parse(JSON.stringify(state)));
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
          <MovieDetailsBlockInfos
            movie={movie}
            setSeenOnClick={() => this.props.setSeen(movie)}
          />

          <div className="movie-details-plot">
            <span>{movie.plot}</span>
          </div>
        </div>

        <div className="magnet-wrapper">
          {magnetsLinkButton}
          {magnetsLink}
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

  createMagnets(magnets) {
    if (magnets.length === 0) {
      return <div className="no-magnet">No link for this movie</div>;
    }

    return magnets.map(magnet => (
      <div key={magnet.hash} className="magnet" >
        <CopyToClipboard
          text={magnet.link}
          onCopy={() => this.setState({ copied: true })}
        >
          <span className="magnet-link-wrapper">
            <LinkIcon className="magnet-link-icon"/>
            <div className="magnet-infos-wrapper">
              <div className="magnet-quality">{magnet.quality}</div>
              <div className="magnet-size">{magnet.size}</div>
            </div>
          </span>
        </CopyToClipboard>
      </div>
    ));
  }

  render() {
    if (!this.state.movie) {
      return null;
    }

    return this.createMovieDetails(this.state.movie, this.props.magnets);
  }
}

export default MovieDetails;
