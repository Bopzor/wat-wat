import React, { Component } from 'react';
import CommentInput from '../CommentInput/CommentInput.js'
import {
  RemoveIconButton,
  EditIconButton,
  CancelEditIconButton,
  SubmitEditIconButton,
} from '../IconsButton/IconsButton.js';
import './CommentsZone.css'

class CommentsZone extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editCommentId: null,
      newComment: '',
    }
  }

  onClick(id) {
      this.setState({ editCommentId: id })
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
                  defaultValue={comment.comment}
                  onChange={e => this.setState({ newComment: e.target.value })}
                />
                <div className='edit-comment-buttons'>

                  <SubmitEditIconButton
                    onSubmit={() => {
                      this.props.onSubmitUpdateComment(comment, this.state.newComment)
                        .then(() => this.setState({ 
                          editCommentId: null,
                          newComment: '',
                        }))
                    }}
                  />
                  <CancelEditIconButton onClick={() => this.setState({ editCommentId: null })}/>

                </div>
              </div>
           </div>
          </div>
      )
    }

    return (
      <div key={comment.id} className='comment'>

        <div className='comment-text'>

          <div className='comment-author'>{comment.author} :</div>
          <div className='comment-message'>{comment.comment}</div>

        </div>

        <div className='comment-buttons'>

          <EditIconButton onClick={() => this.onClick(comment.id)}/>
          <RemoveIconButton onClick={() => this.props.removeMovieComment(comment)} />

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
    )
  }
}

export default CommentsZone;