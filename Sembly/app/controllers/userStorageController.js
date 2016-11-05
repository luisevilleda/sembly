import {
  AsyncStorage,
} from 'react-native';

const setUser = userObj =>
  new Promise((resolve, reject) =>
    AsyncStorage.setItem('user', JSON.stringify(userObj), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    }
  )
);

const getUser = () =>
  new Promise((resolve, reject) => {
    AsyncStorage.getItem('user', (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(user));
      }
    });
  });

const destroyUser = () =>
  new Promise((resolve, reject) => {
    AsyncStorage.removeItem('user', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

export { setUser, getUser, destroyUser };
