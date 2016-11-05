import React, { Component } from 'react';
import {
  View,
  Animated,
  Dimensions,
} from 'react-native';

import SVG, {
    Path,
} from 'react-native-svg';

const AnimatedSVG = Animated.createAnimatedComponent(SVG);

/* eslint-disable react/jsx-filename-extension */
class DroppingPin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: {
        y: new Animated.Value(0),
      },
    };

    this.dropPinAnimation = Animated.spring(
      this.state.pin.y,
      {
        toValue: (Dimensions.get('window').height / 2) - (60 / 2),
        velocity: 200,
        tension: 60,
        friction: 5,
      }
    );

    this.dropPin = this.dropPin.bind(this);
  }

  componentWillMount() {
    this.pinStyle = {
      position: 'absolute',
      right: (Dimensions.get('window').width / 2) - (this.props.height / 2),
      bottom: Dimensions.get('window').height,
    };
    this.resetPin();
  }

  componentDidMount() {

  }

  dropPin() {
    this.dropPinAnimation.start();
  }

  resetPin() {
    this.state.pin.y.setValue(Dimensions.get('window').height);
  }

  render() {
    return (
      <View pointerEvents="none" style={[this.props.styleSheet.container]} >

        <AnimatedSVG
          height={this.props.height}
          width={this.props.height}
          style={[this.pinStyle, { bottom: this.state.pin.y }]}
          viewBox="0 0 341.188 511.455"
        >
          <Path
            id="outside"
            fill-rule="evenodd"
            clip-rule="evenodd"
            fill="#E64C3C"
            d="M175.962,0c11.417,0,20.528,2.418,24.982,3.225c71.772,13,128.104,70.796,138.423,142.599c5.932,41.274-2.767,79.424-23.994,115.352c-29.367,49.703-57.817,99.948-86.616,149.987c-18.508,32.157-36.936,64.361-55.409,96.537c-0.731,1.273-1.564,2.488-2.365,3.755c-2.02-0.66-2.368-2.478-3.138-3.816c-45.451-79.041-90.696-158.201-136.391-237.1c-10.545-18.207-20.735-36.354-26.022-56.92C-18.627,120.04,39.582,25.255,133.893,4.424C133.893,4.424,156.877,0,175.962,0z M170.453,277.481c59.199,0.8,107.07-47.438,106.863-106.347c-0.21-59.775-46.863-105.381-104.343-106.542c-61.748-1.247-109.08,47.217-109.139,106.765C63.777,229.965,111.5,278.192,170.453,277.481z"
          />
          <Path
            id="inside"
            fill-rule="evenodd"
            clip-rule="evenodd"
            fill="#C0392B"
            d="M172.973,64.592c-61.748-1.247-109.08,47.217-109.139,106.765c-0.057,58.608,47.666,106.835,106.619,106.124c59.199,0.8,107.07-47.438,106.863-106.347C277.106,111.359,230.453,65.753,172.973,64.592z"
          />
        </AnimatedSVG>
      </View>
    );
  }
}

DroppingPin.defaultProps = {
  height: 75,
};

DroppingPin.propTypes = {
  height: React.PropTypes.number,
};

export default DroppingPin;
