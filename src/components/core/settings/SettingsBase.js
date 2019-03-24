import React, { Component } from 'react';
import { 
  View, 
  Modal,
  StyleSheet,
  Platform,
  StatusBar } from 'react-native';
import { StackNavigator } from 'react-navigation';

import SettingsHomeContainer from '../../../containers/core/settings/SettingsHomeContainer';
import SettingsUserContainer from '../../../containers/core/settings/SettingsUserContainer';
import SettingsDisclaimer from './SettingsDisclaimer';
import SettingsAbout from './SettingsAbout';
import SettingsLegal from './SettingsLegal';
import {getCurrentRouteName} from '../../../helpers/Helpers'

import SafeAreaView from '../../widgets/SafeAreaView';
import NavigationImage from '../../widgets/NavigationImage'
import * as Animatable from 'react-native-animatable';

const ROTATE_ANIMATION_DURATION = 200;
const ARROW_SIZE = 40;

const Styles = StyleSheet.create({
  arrowContainer: {
    zIndex: 2,
    backgroundColor: 'white',
    marginTop: 30,
    paddingBottom: 10,
    paddingLeft: 10
  },
  arrow: {
    width: ARROW_SIZE,
    height: ARROW_SIZE
  },
  leftArrow: {
    transform: [{ rotate: '180deg'}]
  },
  downArrow: {
    transform: [{ rotate: '90deg'}]
  },
  container: {
    flex: 1,
  }
});

const SettingsNavigator = StackNavigator(
  {
    Home: {screen: SettingsHomeContainer},
    User: {screen: SettingsUserContainer},
    About: {screen: SettingsAbout},
    Legal: {screen: SettingsLegal},
    Disclaimer: {screen: SettingsDisclaimer}
  },
  {
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false
    }
});

export default class SettingsBase extends Component {
  constructor(props) {
    super(props);
    this.goBackCallers = [];
    this.state = {
      isHome: true,
      modal: null
    };
  }

  logout() {
    this.props.logout();  
    this.props.onDismiss();
  }

  registerGoBackCaller(caller) {
    this.goBackCallers.push(caller);
  }

  arrowPressed() {
    if (this.state.isHome) {
      this.props.onDismiss();
    } else {
      this.goBackCallers.pop()();
    }
  }

  onNavigationStateChange(prevState, currentState) {
    const currentScreen = getCurrentRouteName(currentState);
    const prevScreen = getCurrentRouteName(prevState);
    if (prevScreen !== currentScreen) {
      this.setState({isHome: currentScreen === "Home"});
    }
  }

  showModal(title, content, dismissable = true) {
    this.setState({
      modal: {
        title,
        content,
        dismissable
      }
    });
  }

  dismissModal() {
    this.modal.dismiss();
  }

  onDismissModal() {
    this.setState({modal: null});
  }

  render() {
    const statusBar = Platform.select({
      ios: <StatusBar animated={true} barStyle="dark-content"/>,
      android: null
    });
    return (
      <Modal
        transparent={false}
        animationType="slide"
        visible={this.props.visible}
        onRequestClose={this.arrowPressed.bind(this)}>
        <SafeAreaView>
          {statusBar}
          <View style={Styles.container}>
            <View style={Styles.arrowContainer}>
              <Animatable.View
                duration={ROTATE_ANIMATION_DURATION}
                transition="rotate"
                style={StyleSheet.flatten([Styles.arrow, this.state.isHome ? Styles.downArrow : Styles.leftArrow])}>
                <NavigationImage
                  type="arrow"
                  color="orange"
                  size={ARROW_SIZE}
                  clickable={true}
                  onPress={this.arrowPressed.bind(this)}/>
              </Animatable.View>
            </View>
            <SettingsNavigator 
              onNavigationStateChange={this.onNavigationStateChange.bind(this)}
              screenProps={{
                registerGoBackCaller: this.registerGoBackCaller.bind(this),
                showModal: this.showModal.bind(this),
                dismissModal: this.dismissModal.bind(this)
              }}/>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}
