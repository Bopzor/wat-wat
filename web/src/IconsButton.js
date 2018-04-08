import React from 'react';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';

const RemoveIconButton = (props) => {
	return (
		<div className='remove-movie-button'>
			<IconButton
				onClick={() => props.onClick()}
			>
				<Icon>remove_circle</Icon>
			</IconButton>
		</div>
	)
};

const SeenButton = (props) => {
	return (
		<div className='seen-movie-button'>
			<IconButton>
				<Icon style={{ fontSize: 48 }}>done_all</Icon>
			</IconButton>
		</div>
	)
};

export {
	RemoveIconButton,
	SeenButton,
}