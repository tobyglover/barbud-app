import React, { Component } from 'react';
import { 
  View,
  Image,
  StyleSheet } from 'react-native';

import T from '../widgets/T';
import Button from '../widgets/Button';

import {FillBackgroundWhite} from '../../statics/styles';

const SIZE = 200;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: .8
  },
  image: {
    maxWidth: SIZE, 
    maxHeight: SIZE,
    flex: 4
  },
  textContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 32,
    flex: 1,
    textAlign: 'center',
  },
  smallText: {
    flex: 1,
    textAlign: 'center'
  },
  button: {
    width: '80%',
    flex: .5
  }
});

export default class WelcomeToBarBud extends Component {
  continue() {
    this.props.navigation.navigate("VenueSearch");
  }

  render() {
    return (
      <View style={FillBackgroundWhite}>
        <View style={Styles.container}>
        <View style={Styles.contentContainer}>
          <Image 
            style={Styles.image}
            source={require('../../statics/images/logo_darkletters.png')}
            resizeMode="contain"/>
          <View style={Styles.textContainer}>
            <T style={Styles.text}>Sign up complete!</T>
            <T type="h3" style={Styles.smallText}>You will receive a confirmation email shortly to complete registration. Happy drinking!</T>
          </View>
          <Button 
            containerStyle={Styles.button}
            text="Continue"
            onPress={this.continue.bind(this)}/>
        </View>
        </View>
      </View>
    );
  }
}
