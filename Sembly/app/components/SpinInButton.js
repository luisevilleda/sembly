import React, { Component } from 'react';
import {
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  Easing,
  Text,
  View,
} from 'react-native';

import SVG, {
    Path,
} from 'react-native-svg';

/**
 * A button that doesn't show, then when the 'show' function is called
 * it spins in and grows.
 * Usage:
 *
 * // Defining style:
 * const styles = StyleSheet.create({
 *   button: {
 *     left: 50
 *     bottom: 250,
 *     position: 'absolute',
 *     backgroundColor: MKColor.Indigo,
 *     shadowRadius: 4,
 *     shadowOffset: { width: 0, height: 0.5 },
 *     shadowOpacity: 0.7,
 *     shadowColor: 'black',
 *     elevation: 4
 *   },
 * });
 *
 * // In render function:
 * render() {
 *   return (
 *       <SpinInButton
 *         size={65}
 *         text="x"
 *         transitionLength={300}
 *         style={styles.button}
 *         action={() => {// do things //}}
 *       />
 *   );
 * }
 */

/* eslint-disable react/jsx-filename-extension */
export default class SpinInButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedScale: new Animated.Value(0),
      animatedRotation: new Animated.Value(0),
      opened: false,
    };

    this.scaleUpAnimation = Animated.timing(
      this.state.animatedScale,
      {
        toValue: 1,
        duration: props.transitionLength,
      }
    );

    this.scaleDownAnimation = Animated.timing(
      this.state.animatedScale,
      {
        toValue: 0,
        duration: props.transitionLength,
      }
    );

    this.rotateInAnimation = Animated.timing(
      this.state.animatedRotation,
      {
        toValue: 360,
        duration: props.transitionLength,
      }
    );

    this.rotateOutAnimation = Animated.timing(
      this.state.animatedRotation,
      {
        toValue: 300,
        duration: props.transitionLength,
      }
    );

    this.handlePress = this.handlePress.bind(this);
  }

  componentWillMount() {
    this.buttonProps = {
      height: this.props.size,
      width: this.props.size,
      borderRadius: this.props.size / 2,
      alignItems: 'center',
      justifyContent: 'center',
      transform: [
        { rotate: this.state.animatedRotation.interpolate(
          {
            inputRange: [0, 360],
            outputRange: ['0deg', '360deg'],
          }),
        },
        { scale: this.state.animatedScale },
      ],
    };

    this.state.animatedScale.setValue(0);
    this.state.animatedRotation.setValue(300);
  }

  hide() {
    this.scaleDownAnimation.start();
    this.rotateOutAnimation.start();
  }

  show() {
    this.rotateInAnimation.start();
    this.scaleUpAnimation.start();
  }

  handlePress() {
    this.props.action();
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.handlePress}>
        <Animated.View
          style={
            [
              this.props.style,
              this.buttonProps,
            ]}
        >
          <SVG width={this.props.size * 0.4} height={this.props.size * 0.4} viewBox="0 0 400 400">
            <Path
              fill={this.props.xColor}
              d="M127.407,200.494L0,73.084L72.099,0.987l127.407,127.409L327.901,0l72.098,72.098L271.604,200.494l127.407,127.409L326.913,400L199.506,272.592L72.759,399.342l-72.099-72.1L127.407,200.494z"
            />
          </SVG>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

SpinInButton.defaultProps = {
  size: 64,
  text: '',
  transitionLength: 333,
  action: null,
  xColor: '#ffffff',
};

SpinInButton.propTypes = {
  size: React.PropTypes.number,
  text: React.PropTypes.string,
  transitionLength: React.PropTypes.number,
  action: React.PropTypes.func,
  xColor: React.PropTypes.string,
  style: React.PropTypes.number,
};
