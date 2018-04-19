import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import { searchMovieTitle } from '../../actionsToApis.js'
import { FilterSeenButton, FilterNotSeenButton } from '../IconsButton/IconsButton.js';
import './AddMovieInput.css'

const getSuggestionValue = suggestion => suggestion;

const renderSuggestion = suggestion => {
  return (
    <div>
      {suggestion}
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

      searchMovieTitle(value)
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

  onSuggestionSelected = (event, { suggestion }) => {
      this.setState({ title: suggestion})
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
            />
          </form>

      </div>
    )
  }
}

export default AddMovieInput;