import React from 'react';
import { View } from 'react-native';

const FBSDK = require('react-native-fbsdk');

const {
  LoginButton,
  AccessToken,
} = FBSDK;

const FacebookLoginButton = () => (
  <View>
    <LoginButton
      publishPermissions={['publish_actions']}
      onLoginFinished={
        (error, result) => {
          if (error) {
            console.log(`login has error: ${JSON.stringify(error)}`);
          } else if (result.isCancelled) {
            console.log('login is cancelled.');
          } else {
            AccessToken.getCurrentAccessToken().then(
              (data) => {
                console.log(`token: ${data.accessToken.toString()}`);
              }
            );
          }
        }
      }
      onLogoutFinished={() => console.log('logout.')}
    />
  </View>
);

export default FacebookLoginButton;
