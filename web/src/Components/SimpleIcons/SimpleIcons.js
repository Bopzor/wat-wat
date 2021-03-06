import React from 'react';
import Icon from '@material-ui/core/Icon';
import './SimpleIcons.css';

const ListSeen = props => {
  if (!props.isSeen) {
    return (
      <div className="list-seen-movie-icon">
        <Icon style={{ fontSize: 18 }} color="disabled">done_all</Icon>
      </div>
    );
  }

  return (
    <div className="list-seen-movie-icon">
      <Icon style={{ fontSize: 18 }} color="primary">done_all</Icon>
    </div>
  );
};

const SortIcon = () => (
  <div className="sort-movie-icon">
    <Icon style={{ fontSize: 24 }} color="secondary">swap_vert</Icon>
  </div>
);

const LinkIcon = () => (
  <div className="link-icon">
    <Icon style={{ fontSize: 24 }} color="primary">link</Icon>
  </div>
);

export {
  ListSeen,
  SortIcon,
  LinkIcon,
};
