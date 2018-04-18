import React, { Component } from 'react';
import CommentInput from './CommentInput.js'
import { RemoveIconButton, EditIconButton } from './IconsButton.js';

class CommentsZone extends Component {
	createMovieComment(comment) {
		return (
			<div key={comment.id} className='comment'>

		        <div className='comment-text'>

		            <div className="comment-author">{comment.author} :</div>
		            <div className="comment-message">{comment.comment}</div>

	            </div>

	            <div className='comment-buttons'>

	            	<EditIconButton />
	            	<RemoveIconButton onClick={() => this.props.removeMovieComment(comment)} />

				</div>

			</div>
		);
};

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