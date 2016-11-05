import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';

import { MKColor } from 'react-native-material-kit';
import ExpandingButton from './ExpandingButton';
import DroppingPin from './DroppingPin';
import NewEventModal from './NewEventModal';
import SpinInButton from './SpinInButton';

/* eslint-disable react/jsx-filename-extension */

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 60,
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  createEventButton: {
    bottom: 32,
    position: 'absolute',
    backgroundColor: MKColor.Indigo,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.7,
    shadowColor: 'black',
    elevation: 4,
  },
  closeSetEventButton: {
    bottom: 72,
    right: 32,
    position: 'absolute',
    backgroundColor: '#393939',
    opacity: 0.97,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.7,
    shadowColor: 'black',
    elevation: 6,
  },
});

export default class EventCreationWrapper extends Component {

  constructor(props) {
    super(props);

    this.handleClosedPress = this.handleClosedPress.bind(this);
    this.handleOpenedPress = this.handleOpenedPress.bind(this);
    this.cancelSetPin = this.cancelSetPin.bind(this);
    this.modalIsClosing = this.modalIsClosing.bind(this);
  }

  handleClosedPress() {
    this.droppingPin.dropPin();
    this.cancelButton.show();
    this.createButton.open();
  }

  handleOpenedPress() {
    this.eventModal.open();
  }

  cancelSetPin() {
    this.cancelButton.hide();
    this.droppingPin.resetPin();
    this.createButton.close();
  }

  modalIsClosing() {
    this.droppingPin.resetPin();
    this.cancelButton.hide();
    this.createButton.close();
  }

  render() {
    return (
      <View style={styles.container} pointerEvents="box-none">
        <ExpandingButton
          ref={(x) => { this.createButton = x; }}
          height={64}
          align="right"
          horizontalMargin={32}
          closedText="+"
          openedText="Place Event"
          transitionLength={300}
          style={styles.createEventButton}
          closedAction={this.handleClosedPress}
          openedAction={this.handleOpenedPress}
        />
        <SpinInButton
          ref={(x) => { this.cancelButton = x; }}
          size={48}
          xColor="#eee"
          transitionLength={200}
          style={styles.closeSetEventButton}
          action={this.cancelSetPin}
        />
        <DroppingPin
          ref={(x) => { this.droppingPin = x; }}
          height={75}
          styleSheet={styles}
        />
        <NewEventModal
          ref={(x) => { this.eventModal = x; }}
          createEvent={this.props.createEvent}
          userId={this.props.user._id} // currently just used to fetch friends. would love to get rid of this
          modalIsClosing={this.modalIsClosing}
        />
      </View>
    );
  }
}

EventCreationWrapper.propTypes = {
  createEvent: React.PropTypes.func.isRequired,
};
