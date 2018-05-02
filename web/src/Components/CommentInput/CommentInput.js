import React, { Component } from 'react';
import { AddIconButton } from '../IconsButton/IconsButton.js';
import './CommentInput.css'

class CommentInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      author: '',
      comment: ''
    };
  }

  render() {

    const onSubmit= e => {
      e.preventDefault();
      this.props.onSubmitMovieComment(this.state.author, this.state.comment)
        .then(() => this.setState({
          author: '',
          comment: '',
        }));
    };

    return (
      <div className="full-comment-input">

        <form
          className="comment-input"
          onSubmit={onSubmit}
        >
          <input
            id="author-name"
            type="text"
            placeholder="Name"
            value={this.state.author}
            onChange={e => this.setState({ author: e.target.value })}
          />
          <textarea
            id="comment-text"
            rows="2"
            placeholder="Say it!"
            value={this.state.comment}
            onChange={e => this.setState({ comment: e.target.value })}
          />

        </form>

          <AddIconButton
            onSubmit={onSubmit}
          />

      </div>
    )
  }
}

export default CommentInput;