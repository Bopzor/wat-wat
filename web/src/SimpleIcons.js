import React from 'react';
import Icon from 'material-ui/Icon';
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import green from 'material-ui/colors/green';
import orange from 'material-ui/colors/orange';

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: orange,
  },
});

const ListSeenButton = (props) => {
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
	)
};

export { ListSeenButton }