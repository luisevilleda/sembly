import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';

import MapView from 'react-native-maps';
import Spinner from './Spinner';
import OurDrawer from './OurDrawer';
import _navigate from './navigateConfig';
import EventCreationWrapper from './EventCreationWrapper';
import { getUser } from '../controllers/userStorageController';

/* eslint-disable react/jsx-filename-extension */

const styles = StyleSheet.create({
  map: {
    height: Dimensions.get('window').height - 60,
  },
  spinner: {
    padding: 30,
    marginTop: 200,
    alignItems: 'center',
  },
});

export default class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      markers: [],
      modalVisible: false,
      region: {
        latitude: props.mongoLocation[1],
        longitude: props.mongoLocation[0],
        latitudeDelta: 0.04,
        longitudeDelta: 0.02,
      },
    };

    this.createEvent = this.createEvent.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
  }

  componentWillMount() {
    this.fetchEvents();
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  fetchEvents() {
    getUser()
    .then(user =>
      fetch('http://localhost:3000/api/events/bundle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          facebookId: user.facebookId,
          location: this.props.mongoLocation,
        }),
      })
      .then(data => data.json())
      .then(data => this.setState({ markers: data, loading: false }))
    )
    .catch((error) => {
      console.log('Error fetching events', error.message);
      throw error;
    });
  }

  openModal() {
    this.setState({ modalVisible: true });
  }

  createEvent(modalEventData) {
    return getUser()
    .then((user) => {
      const facebookId = user.facebookId;
      const mapLevelEventData = {
        location: [this.state.region.longitude, this.state.region.latitude],
        hostId: facebookId,
      };

      const eventData = Object.assign({}, modalEventData, mapLevelEventData);

      return fetch('http://localhost:3000/api/events',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
        }
      );
    })
    .catch((error) => {
      console.log('Error creating event', error.message);
      throw error;
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <OurDrawer user={this.props.user} topBarFilterVisible={true} topBarName={'Sembly'} _navigate={ _navigate.bind(this)}>
          <View style={styles.spinner}>
            <Spinner />
          </View>
        </OurDrawer>
      );
    }
    else {
      return (
        <OurDrawer user={this.props.user} topBarFilterVisible={true} topBarName={'Sembly'} _navigate={ _navigate.bind(this)}>
          <View>
            <MapView
              showsUserLocation
              onRegionChange={this.onRegionChange}
              style={styles.map}
              initialRegion={{
                latitude: this.state.region.latitude,
                longitude: this.state.region.longitude,
                latitudeDelta: this.state.region.latitudeDelta,
                longitudeDelta: this.state.region.longitudeDelta,
              }}
            >
              {this.state.markers.map((marker) => {
                const markerLocation = {
                  latitude: marker.location[1],
                  longitude: marker.location[0]
                };
                return (
                  <MapView.Marker
                    key={marker._id}
                    coordinate={markerLocation}
                    title={marker.name}
                    pinColor='blue'
                  />
                );
              })}
            </MapView>
            <EventCreationWrapper user={this.props.user} createEvent={this.createEvent} />
          </View>
        </OurDrawer>
      );
    }
  }
}
