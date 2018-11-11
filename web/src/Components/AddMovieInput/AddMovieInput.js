import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import { searchMovieTitle } from '../../actionsToApis.js';
import { SeenButton } from '../IconsButton/IconsButton.js';
import './AddMovieInput.css';

const timeOut = 500;

const getSuggestionValue = suggestion => suggestion.title;

const renderSuggestion = suggestion => (
  <div>
    {suggestion.title}
  </div>
);

const renderSuggestionsContainer = (highlighted_poster, { containerProps, children }) => (
  <div {...containerProps}>
    <div className="suggestions-container">
      <div className="suggestions-list">{children}</div>
      <div className="highlighted-poster">
        <div className="highlighted-image-poster">
          {highlighted_poster && <img src={highlighted_poster} alt="movie poster"/>}
        </div>
      </div>
    </div>
  </div>
);

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

  shouldRenderSuggestions = value => value.trim().length > 3;

  onSuggestionsFetchRequested = ({ value, reason }) => {
    if (reason === 'input-focused'){
      return;
    }

    if (reason === 'input-changed') {
      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {

        searchMovieTitle(value)
          .then(movies => {
            if (!movies.length) {
              let prevValue = value.split(' ');

              prevValue.splice(prevValue.length - 1, 1);

              searchMovieTitle(prevValue.join(' '))
                .then(movies => {
                  if (!movies.length) {
                    this.setState({ suggestions: [] });
                  }

                  this.setState({ suggestions: movies });
                })
            }

            this.setState({ suggestions: movies });
          });

      }, timeOut);
    }
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    this.setState({ title: suggestion.title });
  };

  onSuggestionHighlighted = ({ suggestion }) => {
    this.setState({ highlighted: suggestion });
  };

  render() {
    const { title, suggestions, highlighted } = this.state;

    const onSubmit = e => {
      e.preventDefault();
      this.props.onSubmitMovieTitle(title)
        .then(() => this.setState({ title: '' }));
    };

    const inputProps = {
      placeholder: 'New Movie Title',
      value: title,
      onChange: this.onChange,
    };

    return (
      <div>

        <div className="filters">

          <SeenButton
            className="not-seen-filter-button"
            onClick={() => this.props.onFilterNotSeenClick()}
            isSeen={this.props.isSeen.notSeen}
            style={{ fontSize: 30 }}
            styleBis={{ fontSize: 18 }}
            color="disabled"
            colorBis="disabled"
            icon="done_all"
          />
          <SeenButton
            className="seen-filter-button"
            onClick={() => this.props.onFilterSeenClick()}
            isSeen={this.props.isSeen.seen}
            style={{ fontSize: 30 }}
            styleBis={{ fontSize: 18 }}
            color="primary"
            colorBis="primary"
            icon="done_all"
          />

        </div>

        <form className="form-add-movie-title" onSubmit={onSubmit}>
          <Autosuggest
            id="add-movie-title"
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
    );
  }
}

export default AddMovieInput;
