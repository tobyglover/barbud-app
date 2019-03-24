/*
 * Component for Welcome Screen of app. Prompts user to sign up or log in.
 */

import React, { Component } from 'react';
import { View,
  Image, 
  StyleSheet } from 'react-native';

import Button from '../widgets/Button';
import {FillBackgroundGray} from '../../statics/styles';

const Styles = StyleSheet.create({
  backgroundContainer: StyleSheet.flatten([FillBackgroundGray, {
    flex: 1,
    justifyContent: 'center'
  }]),
  contentContainer: {
    flex: .7,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  imageContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  button: {}
});

const size = 200;

export default class WelcomeScreen extends Component {
  openSignUp() {
    this.props.navigation.navigate('SignUp');
  }

  openLogIn() {
    this.props.navigation.navigate('LogInScreen');
  }

  render() {
    return (
      <View style={Styles.backgroundContainer}>
        <View style={Styles.contentContainer}>
          <View style={Styles.imageContainer}>
            <Image 
              style={{width: size, height: size}}
              source={require('../../statics/images/logo.png')}
              resizeMode="contain"/>
          </View>
          <View style={Styles.buttonContainer}>
            <Button
              text="Sign Up"
              onPress={this.openSignUp.bind(this)}
              type='CTAButtonWhite' />
            <Button
              text="Log In"
              onPress={this.openLogIn.bind(this)}
              type='CTAButtonWhite' />
          </View>
        </View>
      </View>
    );
  }
}
