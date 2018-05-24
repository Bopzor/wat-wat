import React, { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import MovieDetailsBlockInfos from '../MovieDetailsBlockInfos/MovieDetailsBlockInfos.js';
import { GenericButton } from '../IconsButton/IconsButton.js';
import CommentsZone from '../CommentsZone/CommentsZone.js';
import { LinkIcon } from '../SimpleIcons/SimpleIcons.js';
import './MovieDetails.css';

class MovieDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      copied: false,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const displayMagnets = { displayMagnets: nextProps.displayMagnets };

    return displayMagnets;
  }

  handleClik(movie) {
    return this.props.getMagnet(movie)
      .then(() => this.setState({ displayMagnets: !this.state.displayMagnets }));
  }

  createMovieDetails(movie, magnets) {
    let magnetsLink = null;

    if (this.state.displayMagnets) {
      if (magnets.length > 0) {
        magnetsLink = magnets.map(magnet => this.createMagnets(magnet));
      } else {
        magnetsLink = this.createMagnets(null);
      }
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
          <GenericButton
            className="get-magnet-button"
            onClick={() => this.handleClik(movie)}
            style={{ fontSize: 48 }}
            color="secondary"
            icon="movie"
          />
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

  createMagnets(magnet) {
    if (magnet === null) {
      return <div className="no-magnet">No link for this movie</div>;
    }

    return (
      <div key={magnet.imdbId} className="magnet" >
        <CopyToClipboard
          text={magnet.link}
          onCopy={() => this.setState({ copied: true })}
        >
          <span>
            <LinkIcon className="magnet-link-icon"/>
            <div className="magnet-tooltip"><span className="magnet-quality">{magnet.quality}</span>
              <span className="magnet-size">{magnet.size}</span>
            </div>
          </span>
        </CopyToClipboard>
      </div>
    );
  }

  render() {
    if (!this.props.movie) {
      return null;
    }

    return this.createMovieDetails(this.props.movie, this.props.magnets);
  }
}

export default MovieDetails;
