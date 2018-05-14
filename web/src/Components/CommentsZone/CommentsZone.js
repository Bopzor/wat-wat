import React, { Component } from 'react';
import CommentInput from '../CommentInput/CommentInput.js';
import { GenericButton } from '../IconsButton/IconsButton.js';
import './CommentsZone.css';

class CommentsZone extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editCommentId: null,
      newComment: '',
    };
  }

  onClick(comment) {
      this.setState({
        editCommentId: comment.id,
        newComment: comment.comment,
      });
    }

  createMovieComment(comment) {


    if(this.state.editCommentId === comment.id) {
      return (
          <div key={comment.id} className='comment'>

            <div className='comment-text'>

              <div className='comment-author'>{comment.author} :</div>
              <div className='edit-comment-input'>
                <textarea
                  className='edit-comment-textarea'
                  value={this.state.newComment}
                  onChange={e => this.setState({ newComment: e.target.value })}
                />
                <div className='edit-comment-buttons'>

                  <GenericButton
                    className="submit-edit-comment-button"
                    onAction={() => {
                      if (this.state.newComment) {
                        this.props.onSubmitUpdateComment(comment, this.state.newComment)
                          .then(() => this.setState({
                            editCommentId: null,
                            newComment: '',
                          }));
                      }
                      this.setState({ editCommentId: null });
                    }}
                    style={{ fontSize: 24 }}
                    color="secondary"
                    icon="done"
                  />
                  <GenericButton
                    className="cancel-edit-comment-button"
                    onAction={() => this.setState({ editCommentId: null })}
                    style={{ fontSize: 24 }}
                    color="secondary"
                    icon="cancel"
                  />

                </div>
              </div>
           </div>
          </div>
      );
    }

    return (
      <div key={comment.id} className='comment'>

        <div className='comment-text'>

          <div className='comment-author'>{comment.author} :</div>
          <div className='comment-message'>{comment.comment}</div>

        </div>

        <div className='comment-buttons'>

          <GenericButton
            className="edit-comment-button"
            onAction={() => this.onClick(comment)}
            style={{ fontSize: 24 }}
            color="secondary"
            icon="edit"
          />
          <GenericButton
            className="remove-button"
            onAction={() => this.props.removeMovieComment(comment)}
            style={{ fontSize: 24 }}
            color="secondary"
            icon="remove_circle"
          />

        </div>

      </div>
    );
}

  render() {

    return (
      <div className='full-comments-zone'>

        <CommentInput
          onSubmitMovieComment={(author, comment) => this.props.onSubmitMovieComment(author, comment)}
        />

        <div className='comments-zone'>
          {this.props.movie.comments.map(comment => this.createMovieComment(comment))}
        </div>

      </div>
    );
  }
}

export default CommentsZone;
