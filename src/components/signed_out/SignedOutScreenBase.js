import React, { Component } from 'react';
import { 
  View,
  StyleSheet,
  Platform} from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper'

import NavigationImage from '../widgets/NavigationImage';
import T from '../widgets/T';
import SafeAreaView from '../widgets/SafeAreaView';

import {FillBackgroundGray} from '../../statics/styles';
import {gray} from '../../statics/colors';

const ARROW_SIZE = 30

const Styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 10,
    marginTop: 30,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerContainerAlt: {
    paddingHorizontal: 10,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerText: {
    marginRight: ARROW_SIZE,
    color: 'white',
    textAlign: 'center',
    flex: 1
  },
  contentContainer: {
    flex: 1,
  },
});

export default class SignedOutScreenBase extends Component {
  render() {
    const content = (
      <View style={FillBackgroundGray}>
        <View style={isIphoneX() || Platform.OS == 'android' || this.props.equalHeaderMargins ? Styles.headerContainerAlt: Styles.headerContainer}>
          <NavigationImage
            type={this.props.useX ? "x" : "arrow"}
            color={this.props.useX ? "orange" : "white"}
            size={ARROW_SIZE}
            clickable={true}
            onPress={this.props.onBackPressed}/>
          <T type="h1" weight="normal" style={Styles.headerText}>{this.props.headerText}</T>
        </View>
        <View style={Styles.contentContainer}>
          {this.props.children}
        </View>
      </View>
    );
    if (this.props.addSafeArea) {
    return (
      <SafeAreaView color={gray}>
        {content}
      </SafeAreaView>
    );
    } else {
      return content;
    }
  }
}
