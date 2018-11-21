import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import { GenericButton } from '../IconsButton/IconsButton.js';

const renderAction = (props) => {
  if (props.title) {

    return (
      <Button
        onClick={() => props.onAdd(props.title)}
        variant="outlined"
        color="primary"
      >
        Add it.
      </Button>
    )
  } else {

    return (
      <GenericButton
        className="snackbar-close-button"
        onClick={props.onClose}
        style={{ fontSize: 24 }}
        color="secondary"
        icon="close"
      />
    )
  }
}

const SnackBar = props => (
  <Snackbar
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    open={props.open}
    autoHideDuration={5000}
    onClose={props.onClose}
    ContentProps={{
      'aria-describedby': 'message-id',
    }}
    message={<span id="message-id">{props.message}</span>}
    action={renderAction(props)}
  />
);

export default SnackBar;
