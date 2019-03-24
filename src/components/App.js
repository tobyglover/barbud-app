import React, { Component } from 'react';
import {Alert, StatusBar, View, StyleSheet} from 'react-native';
import {SignedOutNavigator} from './signed_out/SignedOutNavigator';
import CoreBaseContainer from '../containers/core/CoreBaseContainer';
import {gray} from '../statics/colors'
import SafeAreaView from './widgets/SafeAreaView'
import {getCurrentRouteName} from '../helpers/Helpers'

const Styles = StyleSheet.create({
  container: {
    flex: 1
  },
  staging: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 20,
    backgroundColor: 'red'
  }
}); 

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {cameFromSignUp: false};
  }

  onNavigationStateChange(prevState, currentState) {
    const currentScreen = getCurrentRouteName(currentState);
    const prevScreen = getCurrentRouteName(prevState);
    if (prevScreen !== currentScreen) {
      this.setState({cameFromSignUp: currentScreen === "SignUp"});
    }
  }

  render() {
    if (this.props.networkError) {
      Alert.alert(
        'Network Error',
        'There was an issue connecting to the network. Please check your connection and try again.',
        [{text: 'OK', onPress: this.props.dismissNetworkError}],
        {cancelable: false}
      )
    } else if (this.props.authError) {
      Alert.alert(
        'Logged Out',
        'You have been logged out. Please log in again.',
        [{text: 'OK', onPress: this.props.dismissAuthError}],
        {cancelable: false}
      )
    }

    let content = null

    if (this.props.isLoggedIn) {
      content = <CoreBaseContainer cameFromSignUp={this.state.cameFromSignUp}/>;
    } else {
      content = (
        <SafeAreaView color={gray}>
          <StatusBar
            barStyle="light-content"/>
          <SignedOutNavigator 
            onNavigationStateChange={this.onNavigationStateChange.bind(this)}/>
        </SafeAreaView>
      );
    }

    if (this.props.usingStaging) {
      return (
        <View style={Styles.container}>
          {content}
          <View style={Styles.staging}/>
        </View>
      );
    } else {
      return content;
    }
  }
}

// <BetaCodeContainer />