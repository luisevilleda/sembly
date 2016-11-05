import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
import Promise from 'bluebird';

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
              gener: fbInfoRes.gender,
              pictureUrl: pictureRes.url,
            });
          })
        )
        .catch((err) => {
          console.log('ERR FETCH: ', err);
          reject(err);
        });
      }
    );

    this.setUser = userObj =>
      new Promise((resolve, reject) =>
        AsyncStorage.setItem('user', JSON.stringify(userObj), (err) => {
          if (err) {
            console.log('Error setting user: ', err);
            reject(err);
          } else {
            resolve();
          }
        })
      );

    this.handleLoginData = (data, _this) => {
      const fbInfoRequest = _this.getFbInfo(data);
      fbInfoRequest.then(userObj =>
        _this.props.onLogin(userObj)
        // This was to save the userObj, but when our server
        // Responds with a new user data obj, we save that instead, which includes this stuff
        // _this.setUser(userObj)
        // .then(() => {
        //   console.log('Successfully saved user to AsyncStorage \'user\'');
        //   _this.props.onLogin(userObj);
        //   console.log('SEND userObj TO onLogin:', userObj);
        // })
      )
      .catch(err => console.log('ERROR: ', err));
    };

    this.handleLogout = () => {
      const logoutAsync = new Promise((resolve, reject) => {
        AsyncStorage.removeItem('user', (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      logoutAsync.catch(err => console.log('Logout err: ', err));
    };
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
