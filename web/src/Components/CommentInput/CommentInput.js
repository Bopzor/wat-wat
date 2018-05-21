import React, { Component } from 'react';
import { GenericButton } from '../IconsButton/IconsButton.js';
import './CommentInput.css';

class CommentInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      author: '',
      comment: '',
    };
  }

  render() {

    const onSubmit = e => {
      e.preventDefault();
      this.props.onSubmitMovieComment(this.state.author, this.state.comment)
        .then(() => this.setState({
          author: '',
          comment: '',
        }));
    };

    return (
      <div className="comment-input-wrapper">

        <form
          className="comment-input"
          onSubmit={onSubmit}
        >
          <input
            type="text"
            placeholder="Name"
            value={this.state.author}
            onChange={e => this.setState({ author: e.target.value })}
          />
          <textarea
            rows="2"
            placeholder="Say it!"
            value={this.state.comment}
            onChange={e => this.setState({ comment: e.target.value })}
          />

        </form>

        <GenericButton
          className="add-comment-button"
          onClick={e => onSubmit(e)}
          style={{ fontSize: 48 }}
          color="secondary"
          icon="add_circle"
        />

      </div>
    );
  }
}

export default CommentInput;
