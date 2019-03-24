// custom checkbox

import React, { Component } from 'react';
import {View, StyleSheet, TouchableHighlight} from 'react-native';

import {orange, darkOrange} from '../../statics/colors';
import NavigationImage from './NavigationImage';

const defaultSize = 40;

const calculateStyles = (size) => {
  return StyleSheet.create({
    container: {
      marginHorizontal: 10,
      width: size,
      height: size,
    },
    touchableHighlight: {
      borderRadius: size,
      width: size,
      height: size,
    },
    checkbox: {
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: 2,
      borderColor: darkOrange,
      alignItems: 'center',
      justifyContent: 'center'
    },
    active: {
      backgroundColor: orange
    },
    image: {
      width: size - 10,
      height: size - 10,
    },
  });
}

export default class Checkbox extends Component {
  componentWillMount() {
    this.size = this.props.size || defaultSize;
    this.styles = calculateStyles(this.size);
  }

  render() {
    const containerStyle = this.props.value ? 
                        StyleSheet.flatten([this.styles.checkbox, this.styles.active]) :
                        this.styles.checkbox;
    const checkmark = this.props.value ? 
        <NavigationImage 
          clickable={false}
          type="checkmark"
          color="white"
          size={this.size - 10}/> : null;
    return (
      <View style={this.styles.container}>
        <TouchableHighlight
          style={this.styles.touchableHighlight}
          onPress={() => this.props.onValueChange()}
          underlayColor='gray'>
          <View style={containerStyle}>
            {checkmark}
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}
