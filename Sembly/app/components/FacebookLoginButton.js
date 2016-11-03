import React from 'react';
import ReactNative, { View } from 'react-native';

const { AsyncStorage } = ReactNative;
const FBSDK = require('react-native-fbsdk');

const {
  LoginButton,
  AccessToken,
} = FBSDK;

const FacebookLoginButton = () => (
  <View>
    <LoginButton
      readPermissions={['email', 'public_profile', 'user_friends']}
      publishPermissions={['publish_actions']}
      onLoginFinished={
        (error, result) => {
          if (error) {
            console.log(`login has error: ${JSON.stringify(error)}`);
          } else if (result.isCancelled) {
            console.log('login is cancelled.');
          } else {
            AccessToken.getCurrentAccessToken()
            .then((data) => {
              AsyncStorage.setItem('FBtoken', data.accessToken, (err) => {
                if (err) {
                  console.log('ERROR: ', err);
                } else {
                  console.log('Successfully saved FB token: ', data.accessToken);
                  AsyncStorage.getItem('FBtoken', (e, storageData) => console.log('AsyncStorage getItem: ', storageData));
                }
              });
            });
          }
        }
      }
      onLogoutFinished={() => console.log('logout.')}
    />
  </View>
);

export default FacebookLoginButton;
