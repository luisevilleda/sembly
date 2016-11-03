import React, { PropTypes, Component } from 'react';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';

class FacebookLoginButton extends Component {
  render() {
    const _this = this;
    return (
      <FBLogin
        style={{ marginBottom: 10 }}
        ref={(fbLogin) => { this.fbLogin = fbLogin; }}
        permissions={['email', 'user_friends']}
        loginBehavior={FBLoginManager.LoginBehaviors.Native}
        onLogin={(data) => {
          console.log('Logged in!');
          console.log(data);
          _this.setState({ user: data.credentials });
        }}
        onLogout={() => {
          console.log('Logged out.');
          _this.setState({ user: null });
        }}
        onLoginFound={(data) => {
          console.log('Existing login found.');
          console.log(data);
          _this.setState({ user: data.credentials });
        }}
        onLoginNotFound={() => {
          console.log('No user logged in.');
          _this.setState({ user: null });
        }}
        onError={(data) => {
          console.log('ERROR');
          console.log(data);
        }}
        onCancel={() => {
          console.log('User cancelled.');
        }}
        onPermissionsMissing={(data) => {
          console.log('Check permissions!');
          console.log(data);
        }}
      />
    );
  }
}

export default FacebookLoginButton;
