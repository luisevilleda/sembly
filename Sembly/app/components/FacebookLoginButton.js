import React, { Component } from 'react';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
import Promise from 'bluebird';
import { setUser, destroyUser } from '../controllers/userStorageController';

class FacebookLoginButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };

    this.getFbInfo = data =>
      new Promise((resolve, reject) => {
        const token = data.credentials.token;
        const userId = data.credentials.userId;
        const fields = 'email,name,location,age_range,birthday,gender';
        const params = `access_token=${token}&fields=${fields}`;
        fetch(`https://graph.facebook.com/v2.8/${userId}?${params}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          })
        .then((fbInfoRes) => {
          console.log('RES: ', fbInfoRes);
          return fbInfoRes;
        })
        .then(fbInfoRes => fbInfoRes.json())
        .then(fbInfoRes =>
          fetch(`https://graph.facebook.com/v2.8/${userId}/picture?type=large`)
          // .then(pictureRes => pictureRes.json())
          .then((pictureRes) => {
            console.log('fbInfoRes:', fbInfoRes);
            console.log('pictureRes:', pictureRes.url);
            resolve({
              token: data.credentials.token,
              name: fbInfoRes.name,
              email: fbInfoRes.email,
              facebookId: fbInfoRes.id,
              gender: fbInfoRes.gender,
              photoUrl: pictureRes.url,
            });
          })
        )
        .catch((err) => {
          console.log('ERR FETCH: ', err);
          reject(err);
        });
      }
    );

    this.handleLoginData = (data, _this) => {
      const fbInfoRequest = _this.getFbInfo(data);
      fbInfoRequest.then(userObj =>
        _this.props.onLogin(userObj)
      )
      .catch((err) => {
        console.log('Error handling Facebook login data', err);
      });
    };

    this.handleLogout = () =>
      destroyUser()
        .catch((error) => {
          console.log('Error logging out user', error.message);
        });
  }


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
          _this.handleLoginData(data, _this);
        }}
        onLogout={() => {
          console.log('Logged out.');
          this.handleLogout();
        }}
        onLoginFound={(data) => {
          console.log('Existing login found.');
          _this.handleLoginData(data, _this);
        }}
        onLoginNotFound={() => {
          console.log('No user logged in.');
          // _this.setState({ user: null });
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
