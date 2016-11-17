import React, { PropTypes } from 'react';
import Dropzone from 'react-dropzone';

const AvatarUpdate = (props) => {
  const cacheBuster = Math.random() * 10000000000000000;
  const userBackground = {
    background: `url("https://img.busy.org/@${props.username}/cover?${cacheBuster}") center center / cover`,
  };
  return (
    <div className="profile-header" onClick={props.onClick} style={userBackground}>
      <img alt="Profile" className="profile-image ptl pbm" src={`https://img.busy.org/@${props.username}?${cacheBuster}`} />
      <div className="pbl">
        <Dropzone className="dropzone" onDrop={files => props.onDrop(files, 'profile_image')} accept="image/*">
          <a className="btn btn-secondary">
            <i className="icon icon-md material-icons">file_upload</i> Upload profile image
          </a>
        </Dropzone>{ ' ' }
        <Dropzone className="dropzone" onDrop={files => props.onDrop(files, 'cover_image')} accept="image/*">
          <a className="btn btn-secondary">
            <i className="icon icon-md material-icons">file_upload</i> Upload cover image
          </a>
        </Dropzone>
      </div>
    </div>
  );
};

AvatarUpdate.propTypes = {
  username: PropTypes.string.isRequired,
  onDrop: PropTypes.func,
  onClick: PropTypes.func,
};

export default AvatarUpdate;
