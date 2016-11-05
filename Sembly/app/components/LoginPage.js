import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  // Navigator,
  // TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

import Spinner from './Spinner';
import FacebookLoginButton from './FacebookLoginButton';

const styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 200,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
  },
  button: {
    height: 36,
    flex: 1,
    backgroundColor: '#F44336',
    borderColor: '#F44336',
    borderWidth: 1,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };

    this.setUser = userObj =>
      new Promise((resolve, reject) =>
        AsyncStorage.setItem('user', JSON.stringify(userObj), (err) => {
          if (err) {
            console.log('Error setting user: ', err);
            reject(err);
          } else {
            console.log('Successfully saved user to AsyncStorage \'user\'');
            resolve();
          }
        }
      )
    );
  }

  componentWillMount() {
    this.props.getLocation();
  }

  navigate() {
    this.props.navigator.push({
      name: 'Map',
    });
  }

  login(userData) {
    console.log('USERDATA TO CASH', userData);
    this.setState({ loading: true });
    fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
    .then(response => response.json())
    // .then((res) => console.log(res))
    .then((user) => {
      this.setUser(user)
      .then(() =>
        this.navigate()
      );
    })
    .catch((err) => {
      console.log('LoginPage ERR, make sure you npm start the backend server in the root folder, also server might be responding with a 404. ', err);
      // Remove this navigate after we actually get a response
      this.navigate();
    });
  }

  render() {
    if (this.state.loading) {
      return (<View style={styles.container}><Spinner /></View>);
    }
    else {
      return (
        <View>
          <View style={styles.container}>
            <TouchableOpacity onPress={() => { this.login(); }} style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <FacebookLoginButton onLogin={userData => this.login(userData)} />
          </View>
        </View>
      );
    }
  }
}
