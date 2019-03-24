import React, { Component } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Platform,
  StatusBar } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper'

import T from '../widgets/T';
import {safeAreaOffset} from '../widgets/SafeAreaView';
import NavigationImage from '../widgets/NavigationImage';
import {orange, darkorange} from '../../statics/colors';

const LEAVE_BAR_IMAGE_SIZE = 25;
const SETTINGS_IMAGE_SIZE = 30;

const Styles = StyleSheet.create({
  container: {
    paddingTop: Platform.select({ios: ifIphoneX(safeAreaOffset, 25), android: 10}),
    paddingBottom: 10,
    backgroundColor: orange,
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 2
  },
  leaveBarImage: {
    width: LEAVE_BAR_IMAGE_SIZE, 
    height: LEAVE_BAR_IMAGE_SIZE
  },
  leaveBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    padding: 3
  }
});

export default class CoreBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerMarginRight: 0, 
      useMarginRight: true,
      oneLineHeight: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentRoute != this.props.currentRoute) {
      this.setState({useMarginRight: nextProps.currentRoute != "VenueSearch"});
    }
  }

  onLeaveBarButtonLayout(evt) {
    this.setState({headerMarginRight: evt.nativeEvent.layout.width - SETTINGS_IMAGE_SIZE});
  }

  onContainerLayout(evt) {
    const height = evt.nativeEvent.layout.height;
    if (!this.state.oneLineHeight) {
      this.setState({oneLineHeight: height});
    } else {
      if (height > this.state.oneLineHeight || this.props.currentRoute == "VenueSearch") {
        this.setState({useMarginRight: false});
      } else {
        this.setState({useMarginRight: true});
      }
    }

    this.props.onHeight(height);
  }

  renderLeaveButton() {
    return this.props.currentRoute == "Venue" &&
      <TouchableOpacity
        onPress={this.props.searchPressed}>
        <View style={Styles.leaveBar}
          onLayout={this.onLeaveBarButtonLayout.bind(this)}>
          <Image 
            style={Styles.leaveBarImage}
            source={require('../../statics/images/leave.png')}
            resizeMode="contain"/>
          <T type="h4" style={{color: 'white'}}>Leave</T>
        </View>
      </TouchableOpacity>;
  }

  renderHeaderText() {
    let text = "";
    let style = null;
    if (this.props.currentRoute == "WelcomeToBarBud") {
      text = "Welcome to BarBud!"
    } else if (this.props.currentRoute == "VenueSearch") {
      text = "Search";
      style = {marginLeft: SETTINGS_IMAGE_SIZE};
    } else if (this.props.currentRoute == "Venue") {
      text = this.props.venueName;
    }

    return (
      <T type="h1" 
        style={StyleSheet.flatten([Styles.text, style, this.state.useMarginRight && {marginRight: this.state.headerMarginRight}])}>
        {this.state.oneLineHeight ? text : ""}
      </T>
    );
  }

  renderSettingsButton() {
    return this.props.currentRoute != "WelcomeToBarBud" && 
        <NavigationImage 
          size={SETTINGS_IMAGE_SIZE}
          type="gear"
          color="white"
          clickable={true}
          onPress={this.props.settingsPressed}/>;
  }

  render() {
    return (
      <View style={Styles.container}
        onLayout={this.onContainerLayout.bind(this)}>
        <StatusBar 
          barStyle='light-content'
          backgroundColor={darkorange}/>
        {this.renderLeaveButton()}
        {this.renderHeaderText()}
        {this.renderSettingsButton()}
      </View>
    );
  }
}
