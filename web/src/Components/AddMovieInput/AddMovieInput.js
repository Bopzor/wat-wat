import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import { searchMovieTitle } from '../../actionsToApis.js'
import { FilterSeenButton, FilterNotSeenButton } from '../IconsButton/IconsButton.js';
import './AddMovieInput.css'

const getSuggestionValue = suggestion => suggestion.title;

const renderSuggestion = suggestion => {
    return (
      <div>
        {suggestion.title}
      </div>
    );
};

const renderSuggestionsContainer = (highlighted, { containerProps , children }) => {
  return (
    <div {...containerProps}>
      <div className="suggestions-container">
        <div className="suggestions-list">{children}</div>
        <div className="highlighted-poster">
          <div className="highlighted-image-poster">
            {highlighted && <img src={highlighted} alt='movie poster'/>}
          </div>
        </div>
      </div>
    </div>
  );
}

class AddMovieInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      suggestions: [],
      highlighted: null,
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
      this.setState({ title: suggestion.title})
  };

  onSuggestionHighlighted = ({ suggestion }) => {
    this.setState({ highlighted: suggestion })
  };

  render() {
    const { title, suggestions, highlighted } = this.state;

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
              renderSuggestionsContainer={renderSuggestionsContainer.bind(null, highlighted && highlighted.poster)}
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