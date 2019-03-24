import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper'

import WindowDimensions from '../../helpers/WindowDimensions'

export const safeAreaOffset = 34;

export default class SafeAreaView extends Component {
  componentWillMount() {
    if (isIphoneX()) {
      const safeAreaHeight = WindowDimensions.height - (safeAreaOffset * 2);
      const color = this.props.color || "white";
      this.styles = StyleSheet.create({
        unSafeArea: {
          width: '100%',
          height: safeAreaOffset,
          backgroundColor: color,
          zIndex: 2
        },
        content: {
          height: safeAreaHeight,
          width: '100%',
        }
      });
    }
  }

  render() {
    if (isIphoneX()) {
      return (
        <View>
          <View style={this.styles.unSafeArea}/>
          <View style={this.styles.content}>
            {this.props.children}
          </View>
          <View style={this.styles.unSafeArea}/>
        </View>
      );
    } else {
      return (
        <View style={{height: WindowDimensions.height}}>
          {this.props.children}
        </View>);
    }
  }
} 
