import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import { searchMovieTitle } from '../../actionsToApis.js'
import { FilterSeenButton, FilterNotSeenButton } from '../IconsButton/IconsButton.js';
// import { MovieSuggestionItem } from '../../Components/MovieSuggestionItem/MovieSuggestionItem.js'
import './AddMovieInput.css'

const getSuggestionValue = suggestion => suggestion.title;

const renderSuggestion = suggestion => {
  return (
    <div>
      {suggestion.Title}
    </div>
  );
};

class AddMovieInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      suggestions: [],
    };
    this.timeout = null;
  }

  onChange = e => {
    this.setState({
      title: e.target.value,
    });
  };

  shouldRenderSuggestions = value => {
    return value.trim().length > 3;
  };

  onSuggestionsFetchRequested = ({ value, reason }) => {
    if (reason === 'input-focused') {
      return;
    }

    if (reason === 'input-changed') {

      clearTimeout(this.timeout)

      this.timeout = setTimeout(() => {
        searchMovieTitle(value)
          .then(movies => {
            if (!movies.length) 
              this.setState({ suggestions: [] })

            this.setState({ suggestions: movies });
          });
      }, 500);
    }
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event, { suggestion }) => {
      this.setState({ title: suggestion.Title})
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
      onChange: this.onChange,
    };

    return (
      <div>

        <div className='input-and-filters'>
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

          <form className='form-add-movie-title' onSubmit={onSubmit}>
            <Autosuggest
              id='add-movie-title'
              suggestions={suggestions}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              shouldRenderSuggestions={this.shouldRenderSuggestions}
              inputProps={inputProps}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              onSuggestionSelected={this.onSuggestionSelected}
              onSuggestionHighlighted={this.onSuggestionHighlighted}
            />
          </form>

      </div>
    )
  }
}

export default AddMovieInput;