import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import validator from 'validator';
import { bindActionCreators } from 'redux';
import { each } from 'lodash';
import AvatarUpdate from './AvatarUpdate';
import { setAvatar, accountUpdate, clearUpdatingResult } from '../actions';
import PasswordDialog from '../widgets/PasswordDialog';

class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = { error: {}, showPasswordDialog: false };
  }

  onDrop = (files, type) => {
    this.setState({
      showPasswordDialog: true,
      passwordCallback: passwordOrWif => this.props.setAvatar(passwordOrWif, files[0], type),
    });
  }

  save = (event) => {
    event.preventDefault();
    const user = this.props.auth.user;
    const profileData = {};
    const refs = this.refs;
    each(refs, (item, refKeys) => {
      if (refKeys !== 'gender_female' && refKeys !== 'gender_male') {
        if (typeof item.value === 'string' && item.value.length && !this.state.error[refKeys]) {
          profileData[refKeys] = validator.trim(item.value);
        }
      }
    });

    profileData.gender = refs.gender_female.checked ? 'female' : 'male';
    const json_metadata = user.json_metadata || {};
    json_metadata.profile = profileData;
    this.setState({
      showPasswordDialog: true,
      passwordCallback: passwordOrWif =>
        this.props.accountUpdate(user.name, passwordOrWif, user.memo_key, json_metadata),
    });
  }
  validate = (refKeys) => {
    const refs = this.refs;
    const value = refs[refKeys] && refs[refKeys].value;
    switch (refKeys) {
      case 'email':
        if (value.length && !validator.isEmail(value)) {
          this.state.error[refKeys] = `${refKeys} in not valid`;
          this.setState({ error: this.state.error });
        } else {
          this.state.error[refKeys] = undefined;
          this.setState({ error: this.state.error });
        }
        break;
      case 'website':
        if (value.length && !validator.isURL(value, { require_protocol: true, protocols: ['http', 'https'] })) {
          this.state.error[refKeys] = `${refKeys} in not valid`;
          this.setState({ error: this.state.error });
        } else {
          this.state.error[refKeys] = undefined;
          this.setState({ error: this.state.error });
        }
        break;
      default:
    }
  }

  closePasswordDialog = () => {
    this.setState({ showPasswordDialog: false, passwordCallback: undefined });
    this.props.clearUpdatingResult();
  }
  savePassword = (passwordOrWif) => {
    this.state.passwordCallback(passwordOrWif);
  }

  clearProfile = () => {
    const user = this.props.auth.user;
    const json_metadata = user.json_metadata || {};
    json_metadata.profile = {};
    this.setState({
      showPasswordDialog: true,
      passwordCallback: passwordOrWif =>
        this.props.accountUpdate(user.name, passwordOrWif, user.memo_key, json_metadata),
    });
  }
  render() {
    const user = this.props.auth.user;
    const profile = typeof user.json_metadata.profile === 'object' ? user.json_metadata.profile : {};
    let passwordDialog;
    if (this.state.showPasswordDialog) {
      passwordDialog = (<PasswordDialog
        isUpdating={user.isUpdatingProfile}
        error={user.isUpdatingProfileError}
        onClose={this.closePasswordDialog}
        onSave={this.savePassword}
      />);
    }
    return (
      <div>
        <div className="pbxl">
          <div className="pvxl">
            <h1>Control your public identity</h1>
            <h3>Integrate identity architecture early,
              saving critical time and ensuring security.</h3>
          </div>
          <AvatarUpdate username={user.name} onDrop={this.onDrop} />
          <div className="thin">
              <form className="form form-profile">
                <div className="pam">
                  <fieldset className={"form-group"}>
                    <label htmlFor="name">Name</label>
                    <input autoFocus type="text" defaultValue={profile.name} placeholder="Name" className="form-control" ref="name" />
                  </fieldset>
                  <fieldset className={"form-group"}>
                    <label htmlFor="first_name">First Name</label>
                    <input type="text" placeholder="First Name" defaultValue={profile.first_name} className="form-control" ref="first_name" />
                  </fieldset>
                  <fieldset className={"form-group"}>
                    <label htmlFor="last_name">Last Name</label>
                    <input type="text" placeholder="Last Name" defaultValue={profile.last_name} className="form-control" ref="last_name" />
                  </fieldset>
                  <fieldset className={`form-group ${(this.state.error.email ? 'has-danger' : '')}`}>
                    <label htmlFor="email">Email</label>
                    <input type="email" defaultValue={profile.email} placeholder="Email" className="form-control" ref="email" onBlur={() => this.validate('email')} />
                    <div className="form-control-feedback">{this.state.error.email}</div>
                  </fieldset>
                  <fieldset className="form-group man">
                    <label htmlFor="gender">Gender</label>
                  </fieldset>
                  <fieldset className="form-group">
                    <label className="custom-control custom-radio">
                      <input name="radio" type="radio" value="female" className="custom-control-input" ref="gender_female" defaultChecked={profile.gender === 'female'} />
                      <span className="custom-control-indicator" />
                      <span className="custom-control-description">Female</span>
                    </label>
                    <label className="custom-control custom-radio">
                      <input name="radio" type="radio" value="male" className="custom-control-input" ref="gender_male" defaultChecked={profile.gender === 'male'} />
                      <span className="custom-control-indicator" />
                      <span className="custom-control-description">Male</span>
                    </label>
                  </fieldset>
                  <fieldset className={"form-group"}>
                    <label htmlFor="about">About</label>
                    <textarea className="form-control" defaultValue={profile.about} placeholder="About" rows="3" ref="about" />
                  </fieldset>
                  <fieldset className={`form-group ${(this.state.error.website ? 'has-danger' : '')}`}>
                    <label htmlFor="website">Website</label>
                    <input type="text" defaultValue={profile.website} placeholder="Website" className="form-control" ref="website" onBlur={() => this.validate('website')} />
                    <div className="form-control-feedback">{this.state.error.website}</div>
                  </fieldset>
                  <fieldset className={"form-group"}>
                    <label htmlFor="location">Location</label>
                    <input type="text" placeholder="Location" defaultValue={profile.location} className="form-control" ref="location" />
                  </fieldset>
                </div>
                <fieldset className="form-group man"><button className="btn btn-primary form-submit" onClick={this.save}>Save</button></fieldset>
              </form>
            </div>
            <a href="#" className="btn btn-danger" onClick={this.clearProfile}>Clear Profile</a>
            {passwordDialog}
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  clearUpdatingResult: PropTypes.func,
  accountUpdate: PropTypes.func,
  setAvatar: PropTypes.func,
  auth: PropTypes.shape({
    user: PropTypes.shape({}),
  }),
};

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch =>
  (bindActionCreators({ setAvatar, accountUpdate, clearUpdatingResult }, dispatch));

module.exports = connect(mapStateToProps, mapDispatchToProps)(Settings);
