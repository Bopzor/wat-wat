import React from 'react';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import { createMuiTheme, MuiThemeProvider, withStyles } from 'material-ui/styles';
import green from 'material-ui/colors/green';
import orange from 'material-ui/colors/orange';

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: orange,
  },
});

const RemoveIconButton = (props) => {
	return (
		<MuiThemeProvider theme={theme}>
			<div className='remove-movie-button'>
				<IconButton
					onClick={() => props.onClick()}
				>
					<Icon color="secondary">remove_circle</Icon>
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
		)
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

export {
	RemoveIconButton,
	SeenButton,
}