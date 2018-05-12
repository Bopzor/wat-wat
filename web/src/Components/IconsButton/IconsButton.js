import React from 'react';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import './IconsButton.css';

const RemoveIconButton = (props) => {
  return (
      <div className='remove-button'>
        <IconButton
          onClick={() => props.onClick()}
        >

          <Icon style={{ fontSize: 24 }} color="secondary">remove_circle</Icon>

        </IconButton>
      </div>
  );
};

const SeenButton = (props) => {
  if (!props.isSeen) {
    return (
        <div className='seen-movie-button'>
          <IconButton
            onClick={() => props.onClick()}
          >

            <Icon style={{ fontSize: 48 }} color="disabled">done_all</Icon>

          </IconButton>

        </div>
    );
  }

  return (
      <div className='seen-movie-button'>

        <IconButton
          onClick={() => props.onClick()}
        >

          <Icon style={{ fontSize: 48 }} color="primary">done_all</Icon>

        </IconButton>

      </div>
  );
};

const FilterSeenButton = (props) => {
  if (props.isSeen) {
    return (
        <div className='seen-filter-button active'>

          <IconButton
            onClick={() => props.onClick()}
          >

            <Icon style={{ fontSize: 30 }} color="primary">done_all</Icon>

          </IconButton>

        </div>
    );
  }

  return (
      <div className='seen-filter-button'>

        <IconButton
          onClick={() => props.onClick()}
        >

          <Icon style={{ fontSize: 18 }} color="primary">done_all</Icon>

        </IconButton>

      </div>
  );
};

const FilterNotSeenButton = (props) => {
  if (props.isSeen) {
    return (
        <div className='not-seen-filter-button active'>

          <IconButton
            onClick={() => props.onClick()}
          >

            <Icon style={{ fontSize: 30 }} color="disabled">done_all</Icon>

          </IconButton>

        </div>
    );
  }

  return (
      <div className='not-seen-filter-button'>

        <IconButton
          onClick={() => props.onClick()}
        >

          <Icon style={{ fontSize: 18 }} color="disabled">done_all</Icon>

        </IconButton>

      </div>
  );
};

const AddIconButton = (props) => {
  return (
      <div className='add-comment-button'>

        <IconButton
          onClick={e => props.onSubmit(e)}
        >

          <Icon style={{ fontSize: 48 }} color="secondary">add_circle</Icon>

        </IconButton>

      </div>
  );
};

const EditIconButton = (props) => {
  return (
      <div className='edit-comment-button'>

        <IconButton
          onClick={() => props.onClick()}
        >

          <Icon style={{ fontSize: 24 }} color="secondary">edit</Icon>

        </IconButton>

      </div>
  );
};

const CancelEditIconButton = (props) => {
  return (
      <div className='cancel-edit-comment-button'>

        <IconButton
          onClick={() => props.onClick()}
        >

          <Icon style={{ fontSize: 24 }} color="secondary">cancel</Icon>

        </IconButton>

      </div>
  );
};

const SubmitEditIconButton = (props) => {
  return (
      <div className='submit-edit-comment-button'>

        <IconButton
          onClick={() => props.onSubmit()}
        >

          <Icon style={{ fontSize: 24 }} color="secondary">done</Icon>

        </IconButton>

      </div>
  );
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
};
