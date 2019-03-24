// Custom textbox to handle fonts and different types (h1, h2, etc.)

import React, { Component } from 'react';
import {StyleSheet, Text} from 'react-native';

export const fontFamily = "Roboto";

const BaseStyle = {
  fontFamily: fontFamily,
  color: 'black'
};

const Styles = StyleSheet.create({
  h1: {
    ...BaseStyle,
    fontSize: 26,
    fontWeight: 'bold'
  },
  h2: {
    ...BaseStyle,
    fontSize: 22,
    fontWeight: 'bold'
  },
  h3: {
    ...BaseStyle,
    fontSize: 20,
  },
  h4: {
    ...BaseStyle,
    fontSize: 17
  },
  p: {
    ...BaseStyle,
    fontSize: 15
  }
});

export default class T extends Component {
  render() {
    const style = Styles[this.props.type] || Styles.p;
    const weight = this.props.weight ? 
                    {fontWeight: this.props.weight == "light" ? '300' : this.props.weight} : 
                    null;
    return (
      <Text style={StyleSheet.flatten([style, weight, {textDecorationLine: this.props.underline ? "underline" : 'none'}, this.props.style])} onLayout={this.props.onLayout} allowFontScaling={false}>
        {this.props.children}
      </Text>
    );
  }
}
