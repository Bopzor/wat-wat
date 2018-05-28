import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { GenericButton } from '../IconsButton/IconsButton.js';

const SnackBar = props => (
  <Snackbar
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    open={props.open}
    onClose={props.onClose}
    ContentProps={{
      'aria-describedby': 'message-id',
    }}
    message={<span id="message-id">{props.message}</span>}
    action={
      <GenericButton
        className="snackbar-close-button"
        onClick={props.onClose}
        style={{ fontSize: 24 }}
        color="secondary"
        icon="close"
      />
    }
  />
);

export default SnackBar;
