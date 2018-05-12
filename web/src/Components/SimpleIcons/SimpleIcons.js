import React from 'react';
import Icon from 'material-ui/Icon';
import { MuiThemeProvider } from 'material-ui/styles';
import theme from '../../theme';
import './SimpleIcons.css';

const ListSeen = (props) => {
  if (!props.isSeen) {
    return (
      <MuiThemeProvider theme={theme}>

        <div className='list-seen-movie-icon'>
          <Icon style={{ fontSize: 18 }} color="disabled">done_all</Icon>
        </div>

      </MuiThemeProvider>
    );
  }

  return (
    <MuiThemeProvider theme={theme}>

      <div className='list-seen-movie-icon'>
        <Icon style={{ fontSize: 18 }} color="primary">done_all</Icon>
      </div>

    </MuiThemeProvider>
  );
};

const SortIcon = () => {
  return (
    <MuiThemeProvider theme={theme}>

      <div className='sort-movie-icon'>
        <Icon style={{ fontSize: 24 }} color="secondary">swap_vert</Icon>
      </div>

    </MuiThemeProvider>
  );
};

export {
  ListSeen,
  SortIcon,
 };
