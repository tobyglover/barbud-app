// Component for text inputs with a label to the left

import React, { Component } from 'react';
import {StyleSheet, 
  View, 
  TextInput, 
  TouchableHighlight,
  Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';

import T, {fontFamily} from './T';
import {orange} from '../../statics/colors';

export const LABEL_MOVE_ANIMATION_DURATION = 150;
const fontSize = 20;
const paddingHorizontal = 8;
const labelStyle = {
  position: 'absolute',
  fontFamily: fontFamily,
};

export const Styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  smallLabel: {
    ...labelStyle,
    color: 'gray',
    fontSize: 16,
    top: 0,
    left: paddingHorizontal,
  },
  largeLabel: {
    ...labelStyle,
    color: 'black',
    fontSize: fontSize,
    top: Platform.select({ios: 12, android: 16}),
    left: paddingHorizontal,
  },
  textInputArea: {
    height: Platform.select({ios: 50, android: 60}),
    paddingHorizontal: paddingHorizontal,
    backgroundColor: 'white',
    borderRadius: 3,
    borderWidth: 1,
    justifyContent: 'center'
  },
  textInput: {
    fontSize: fontSize,
    fontFamily: fontFamily,
    width: '100%',
    ...Platform.select({
      ios: {marginTop: 10},
      android: {position: 'absolute', bottom: -30}
    })
  },
  invalidText: {
    color: 'red'
  },
  optionalText: {
    color: 'white'
  }
});

export default class TextInputWithLabel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validationMessage: '',
      isFocused: false}
  }

  focus() {
    this.textInput.focus();
    this.setState({isFocused: true});
  }

  onFocus() {
    this.props.onFocus && this.props.onFocus();
    this.setState({
      validationMessage: '',
      isFocused: true
    });
  }

  onBlur() {
    this.props.onBlur && this.props.onBlur();
    this.setState({isFocused: false});
    this.validate();
  }

  validate() {
    if (this.props.value) {
      this.setState({validationMessage: this.props.validationMessage})
    }
  }

  renderMessage() {
    if (this.props.hideValidationMessage) {
      return null;
    }

    const showOptional = !this.state.validationMessage && this.props.showOptional;
    const message = showOptional ? "(Optional)" : this.state.validationMessage || " ";
    return (
      <T style={showOptional ? Styles.optionalText : Styles.invalidText}>
        {message}
      </T>
    );
  }

  render() {
    const textInputStyle = StyleSheet.flatten([Styles.textInputArea, 
      {borderColor: this.state.validationMessage ? 'red' : this.props.borderColor || 'white'}])
    return (
      <View style={StyleSheet.flatten([Styles.container, this.props.style])}>
        <TouchableHighlight
          onPress={this.focus.bind(this)}>
          <View style={textInputStyle}> 
            <Animatable.Text duration={LABEL_MOVE_ANIMATION_DURATION} transition={["fontSize", "left", "top"]} 
              style={StyleSheet.flatten([this.props.value || this.state.isFocused ? Styles.smallLabel : Styles.largeLabel, this.props.activeLabelColor && {color: this.props.activeLabelColor}, this.state.validationMessage && {color: 'red'}])}>
              {this.props.label}
            </Animatable.Text>
            <View style={Styles.textInputContainer}>
              <TextInput
                ref={textInput => this.textInput = textInput}
                style={Styles.textInput}
                value={this.props.value}
                placeholderTextColor={orange}
                onChangeText={this.props.onChangeText}
                onSubmitEditing={this.props.onSubmitEditing}
                onBlur={this.onBlur.bind(this)}
                onFocus={this.onFocus.bind(this)}
                underlineColorAndroid="transparent"
                {...this.props.textInputProps}/>
              </View>
          </View>
        </TouchableHighlight>
        {this.renderMessage()}
      </View>
    );
  }
}
