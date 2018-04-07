import React from 'react';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';

const RemoveIconButton = (props) => (
	<div className='remove-movie-button'>
		<IconButton
			onClick={() => props.onClick()}
			size='small'>
			<Icon>remove_circle</Icon>
		</IconButton>
	</div>
);

export default RemoveIconButton;