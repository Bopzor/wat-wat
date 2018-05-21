import React from 'react';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import './IconsButton.css';

const GenericButton = props => (
  <div className={props.className}>
    <IconButton
      onClick={e => props.onClick(e)}
    >

      <Icon style={props.style} color={props.color}>{props.icon}</Icon>

    </IconButton>
  </div>
);

const SeenButton = props => {
  if (props.isSeen)
    return (
      <div className={props.className}>
        <IconButton
          onClick={() => props.onClick()}
        >

          <Icon style={props.style} color={props.color}>{props.icon}</Icon>

        </IconButton>

      </div>
    );

  return (
    <div className={props.className}>

      <IconButton
        onClick={() => props.onClick()}
      >

        <Icon style={props.styleBis} color={props.colorBis}>{props.icon}</Icon>

      </IconButton>

    </div>
  );
};

export {
  GenericButton,
  SeenButton,
};
