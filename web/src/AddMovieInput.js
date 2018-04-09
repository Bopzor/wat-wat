import React, { Component } from 'react';
import { FilterSeenButton, FilterNotSeenButton } from './IconsButton.js';

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
			<div className='input-and-filters'>
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
				<div className='filters'>
					<FilterNotSeenButton
						isSeen={this.props.isSeen.notSeen}
						onClick={() => this.props.onFilterNotSeenClick()}
					/>
					<FilterSeenButton
						isSeen={this.props.isSeen.seen}
						onClick={() => this.props.onFilterSeenClick()}
					/>
				</div>
			</div>
		)
	}
} 

export default AddMovieInput;