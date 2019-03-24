import React, { Component } from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

import T from './T';
import {semitranslucentgray} from '../../statics/colors';

const Styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semitranslucentgray
  },
  loadingcontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 3,
  },
  text: {
    textAlign: 'center',
    marginTop: 10,
    color: 'black'
  }
});

export default class LoadingIndicator extends Component {
  render() {
    return (
      <View style={Styles.background}>
        <View style={Styles.loadingcontainer}>
          <ActivityIndicator size='large'/>
          <T style={Styles.text}>{this.props.text || "Loading"}</T>
        </View>
      </View>
    );
  }
}
