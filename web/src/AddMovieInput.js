import React, { Component } from 'react';

class AddMovieInput extends Component {
	constructor(props) {
		super(props);

		this.state = { title: '' };
	}

	render() {
		const onSubmit = e => {
			e.preventDefault();
			this.props.onSubmitMovieTitle(this.state.title)
				.then(() => this.setState({ title: '' }));
		}

		return (
				<form onSubmit={onSubmit}>
					<input
						id='add-movie-title'  
						className='add-movie-input' 
						type='text'
						name='NewMovie'
						placeholder='New Movie Title...'
						value={this.state.title}
						onChange={e => this.setState({ title: e.target.value })}
					/>
				</form>
		)
	}
} 

export default AddMovieInput;