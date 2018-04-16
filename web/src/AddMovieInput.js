import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import { searchMovieTitle } from './actionsToApis.js'
import { FilterSeenButton, FilterNotSeenButton } from './IconsButton.js';

let suggestedSearchResult = {}

const getSuggestions = query => searchMovieTitle(query);

const getSuggestionValue = suggestion => suggestion;

const renderSuggestion = suggestion => (
		<input
			id='add-movie-title'  
			className='add-movie-input' 
			type='text'
			name='NewMovie'
		/>
);

class AddMovieInput extends Component {
	constructor(props) {
		super(props);

		this.state = { 
			title: '',
			suggestions: [],
		};
	}

	onChange = (e, { newQuery }) => {
		this.setState({
			title: newQuery,
		});
	};

	onSuggestionsFetchRequested = ({ title }) => {
		getSuggestions(title)
			.then(result => {
				this.setState({ suggestions: result });
			})
	};

	onSuggestionsClearRequested = () => {
	    this.setState({
	      suggestions: []
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