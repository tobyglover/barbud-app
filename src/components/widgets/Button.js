// Custom Button

import React, { Component } from 'react';
import {
  TouchableHighlight,
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native';

import T from './T';
import {lightOrange, orange, darkOrange } from '../../statics/colors';

const Styles = StyleSheet.create({
    label: {
      textAlign: 'center',
      backgroundColor: 'transparent'
    },
    container: {
      width: '100%',
      padding: 10,
    },
    CTAButton: {
      borderRadius: 5,
      padding: 10,
    },
    textButtonContainer: {
      alignItems: 'center'
    },
  });

const ButtonStyles = 
  {
    CTAButtonOrange: {
      button: StyleSheet.flatten([
        Styles.CTAButton,
        {
          backgroundColor: orange
        }]),
      disabledButton: StyleSheet.flatten([
        Styles.CTAButton,
        {
          backgroundColor: lightOrange
        }]),
      label: StyleSheet.flatten([
        Styles.label, 
        {
          color: 'white'
        }]),
      underlayColor: darkOrange
    },
    CTAButtonWhite: {
      button: StyleSheet.flatten([
        Styles.CTAButton,
        {
          backgroundColor: 'white'
        }]),
      label: StyleSheet.flatten([
        Styles.label, 
        {
          color: 'gray'
        }]),
      underlayColor: 'darkgray'
    },
    CTAButtonRed: {
      button: StyleSheet.flatten([
        Styles.CTAButton,
        {
          backgroundColor: 'red'
        }]),
      label: StyleSheet.flatten([
        Styles.label, 
        {
          color: 'white'
        }]),
      underlayColor: 'darkred'
    },
    CTAButtonGray: {
      button: StyleSheet.flatten([
        Styles.CTAButton,
        {
          backgroundColor: 'darkgray'
        }]),
      label: StyleSheet.flatten([
        Styles.label, 
        {
          color: 'white'
        }]),
      underlayColor: 'gray'
    },
};

export default class Button extends Component {
  render() {
    if (this.props.type == "text") {
      return (
        <View style={StyleSheet.flatten([Styles.textButtonContainer, this.props.containerStyle])}>
          <TouchableOpacity
            onPress={this.props.onPress}>
            <View
              style={this.props.style}>
              <T {...this.props.textProps}>
                {this.props.text}
              </T>
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      const style = ButtonStyles[this.props.type] || ButtonStyles.CTAButtonOrange;
      const containerStyle = StyleSheet.flatten([this.props.disabled ? style.disabledButton : style.button, this.props.style]);
      return (
        <View style={StyleSheet.flatten([Styles.container, this.props.containerStyle])}>
          <TouchableHighlight
            style={containerStyle}
            onPress={this.props.onPress}
            underlayColor={style.underlayColor}
            disabled={this.props.disabled}>
            <View>
              <T type="h3" style={style.label}>
                {this.props.text}
              </T>
            </View>
          </TouchableHighlight>
        </View>
      );
    }
  }
}

