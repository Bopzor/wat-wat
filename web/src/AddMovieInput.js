import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import { searchMovieTitle } from './actionsToApis.js'
import { FilterSeenButton, FilterNotSeenButton } from './IconsButton.js';

const getSuggestionValue = suggestion => suggestion;

const renderSuggestion = suggestion => (
		<div>{suggestion}</div>
);

class AddMovieInput extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: '',
			suggestions: [],
		};
	}

	onSuggestionsFetchRequested = ({ title }) => {
		searchMovieTitle(this.state.title)
			.then(result => {
				if (!result.length)
					this.setState({ suggestions: [] })

				this.setState({ suggestions: result });
			})
	};

	onSuggestionsClearRequested = () => {
	    this.setState({
	      suggestions: []
	    });
	};

	onChange = e => {
		this.setState({
			title: e.target.value,
		});
	};

	render() {
		const { title, suggestions } = this.state;

		const onSubmit = e => {
			e.preventDefault();
			this.props.onSubmitMovieTitle(title)
				.then(() => this.setState({ title: '' }));
		}

		const inputProps = {
			placeholder: 'New Movie Title',
			value: title,
			onChange: this.onChange
		};

		return (
			<div className='input-and-filters'>
				
				<form onSubmit={onSubmit}>
				
					<input
						id='add-movie-title'
						className='add-movie-input'
						type='text'
						name='NewMovie'
					/>
					<Autosuggest
						suggestions={suggestions}
						onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
						onSuggestionsClearRequested={this.onSuggestionsClearRequested}
						getSuggestionValue={getSuggestionValue}
						renderSuggestion={renderSuggestion}
						inputProps={inputProps}
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