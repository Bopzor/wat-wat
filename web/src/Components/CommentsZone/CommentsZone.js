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
    const date = comment.createdAt.toDateString();
    const upDate = comment.updatedAt.toDateString();

    if(this.state.editCommentId === comment.id) {
      return (
          <div key={comment.id} className='comment'>

            <div className='comment-text'>

              <div className="comment-header">
                <div className='comment-author'>{comment.author} :</div>
                <div className="comment-date">{date}
                <span className="comment-upDate">{upDate}</span>
                </div>
              </div>

              <div className='edit-comment-input'>
                <textarea
                  className='edit-comment-textarea'
                  value={this.state.newComment}
                  onChange={e => this.setState({ newComment: e.target.value })}
                />
                <div className='edit-comment-buttons'>

                  <GenericButton
                    className="submit-edit-comment-button"
                    onClick={() => {
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
                    onClick={() => this.setState({ editCommentId: null })}
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

         <div className="comment-header">
              <div className='comment-author'>{comment.author} :</div>

              <div className="comment-date">{date}
                <span className="comment-upDate">{upDate}</span>
              </div>
        </div>

        <div className='comment-main'>

          <div className='comment-message'>{comment.comment}</div>


          <div className='comment-buttons'>

            <GenericButton
              className="edit-comment-button"
              onClick={() => this.onClick(comment)}
              style={{ fontSize: 24 }}
              color="secondary"
              icon="edit"
            />
            <GenericButton
              className="remove-button"
              onClick={() => this.props.removeMovieComment(comment)}
              style={{ fontSize: 24 }}
              color="secondary"
              icon="remove_circle"
            />

          </div>
        </div>

      </div>
    );
}

  render() {
    const comments = this.props.movie.comments.sort((c1, c2) => c1.createdAt < c2.createdAt);

    return (
      <div className='wrapper-comments'>

        <CommentInput
          onSubmitMovieComment={(author, comment) => this.props.onSubmitMovieComment(author, comment)}
        />

        <div className='comments-zone'>
          {comments.map(comment => this.createMovieComment(comment))}
        </div>

      </div>
    );
  }
}

export default CommentsZone;
