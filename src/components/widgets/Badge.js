import React, { Component } from 'react';
import {View, StyleSheet} from 'react-native';

import T from './T';
import {red} from '../../statics/colors';

export const SIZE = 30;

const Styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: red,
    height: SIZE,
    width: SIZE,
    borderRadius: SIZE / 2,
  },
  hiddenContainer: {
    opacity: 0,
    height: SIZE,
    width: SIZE,
    borderRadius: SIZE / 2,
  },
  number: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent'
  },
});

export default class Badge extends Component {
  render() {
    const fontSize = this.props.number < 100 ? 18 : 14;
    const containerStyle = StyleSheet.flatten([
      this.props.hideIfZero && !this.props.number ? Styles.hiddenContainer : Styles.container, this.props.style]);
    return (
      <View style={containerStyle}>
        <T style={StyleSheet.flatten([Styles.number, {fontSize}, this.props.numberStyle])}>{this.props.number}</T>
      </View>
    );
  }
}
