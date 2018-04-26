import React from 'react';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import green from 'material-ui/colors/green';
import orange from 'material-ui/colors/orange';
import './IconsButton.css'

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: {
      main: '#FB8C00'
    },
  },
});

const RemoveIconButton = (props) => {
  return (
    <MuiThemeProvider theme={theme}>

      <div className='remove-button'>
        <IconButton
          onClick={() => props.onClick()}
        >

          <Icon style={{ fontSize: 24 }} color="secondary">remove_circle</Icon>

        </IconButton>
      </div>

    </MuiThemeProvider>
  )
};

const SeenButton = (props) => {
  if (!props.isSeen) {
    return (
      <MuiThemeProvider theme={theme}>

        <div className='seen-movie-button'>
          <IconButton
            onClick={() => props.onClick()}
          >

            <Icon style={{ fontSize: 48 }} color="disabled">done_all</Icon>

          </IconButton>

        </div>

      </MuiThemeProvider>
    );
  }

  return (
    <MuiThemeProvider theme={theme}>

      <div className='seen-movie-button'>

        <IconButton
          onClick={() => props.onClick()}
        >

          <Icon style={{ fontSize: 48 }} color="primary">done_all</Icon>

        </IconButton>

      </div>

    </MuiThemeProvider>
  )
};

const FilterSeenButton = (props) => {
  if (props.isSeen) {
    return (
      <MuiThemeProvider theme={theme}>

        <div className='seen-filter-button active'>

          <IconButton
            onClick={() => props.onClick()}
          >

            <Icon style={{ fontSize: 30 }} color="primary">done_all</Icon>

          </IconButton>

        </div>

      </MuiThemeProvider>
    )
  }

  return (
    <MuiThemeProvider theme={theme}>

      <div className='seen-filter-button'>

        <IconButton
          onClick={() => props.onClick()}
        >

          <Icon style={{ fontSize: 18 }} color="primary">done_all</Icon>

        </IconButton>

      </div>

    </MuiThemeProvider>
  )
};

const FilterNotSeenButton = (props) => {
  if (props.isSeen) {
    return (
      <MuiThemeProvider theme={theme}>

        <div className='not-seen-filter-button active'>

          <IconButton
            onClick={() => props.onClick()}
          >

            <Icon style={{ fontSize: 30 }} color="disabled">done_all</Icon>

          </IconButton>

        </div>

      </MuiThemeProvider>
    )
  }

  return (
    <MuiThemeProvider theme={theme}>

      <div className='not-seen-filter-button'>

        <IconButton
          onClick={() => props.onClick()}
        >

          <Icon style={{ fontSize: 18 }} color="disabled">done_all</Icon>

        </IconButton>

      </div>

    </MuiThemeProvider>
  );
};

const AddIconButton = (props) => {
  return (
    <MuiThemeProvider theme={theme}>

      <div className='add-comment-button'>

        <IconButton
          onClick={() => props.onSubmit()}
        >

          <Icon style={{ fontSize: 48 }} color="secondary">add_circle</Icon>

        </IconButton>

      </div>

    </MuiThemeProvider>
  )
};

const EditIconButton = (props) => {
  return (
    <MuiThemeProvider theme={theme}>

      <div className='edit-comment-button'>

        <IconButton
          onClick={() => props.onClick()}
        >

          <Icon style={{ fontSize: 24 }} color="secondary">edit</Icon>

        </IconButton>

      </div>

    </MuiThemeProvider>
  )
};

const CancelEditIconButton = (props) => {
  return (
    <MuiThemeProvider theme={theme}>

      <div className='cancel-edit-comment-button'>

        <IconButton
          onClick={() => props.onClick()}
        >

          <Icon style={{ fontSize: 24 }} color="secondary">cancel</Icon>

        </IconButton>

      </div>

    </MuiThemeProvider>
  )
};

const SubmitEditIconButton = (props) => {
  return (
    <MuiThemeProvider theme={theme}>

      <div className='submit-edit-comment-button'>

        <IconButton
          onClick={() => props.onSubmit()}
        >

          <Icon style={{ fontSize: 24 }} color="secondary">done</Icon>

        </IconButton>

      </div>

    </MuiThemeProvider>
  )
};

export {
  RemoveIconButton,
  SeenButton,
  FilterSeenButton,
  FilterNotSeenButton,
  AddIconButton,
  EditIconButton,
  CancelEditIconButton,
  SubmitEditIconButton
}