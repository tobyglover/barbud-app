import React, { Component } from 'react';
import { View } from 'react-native';
import { StackNavigator } from 'react-navigation';

import {FillBackgroundWhite} from '../../statics/styles';
import Notifications from '../../helpers/Notifications';
import {getCurrentRouteName} from '../../helpers/Helpers';
import {height} from '../../helpers/WindowDimensions';
import {TotalHeight as StatusPaneHeight} from './statuscard/StatusPane';

import CoreHeader from './CoreHeader';
import WelcomeToBarBud from './WelcomeToBarBud';
import VenueContainer from '../../containers/core/VenueContainer';
import VenueSearchContainer from '../../containers/core/VenueSearchContainer';
import DrinkModalContainer from '../../containers/core/DrinkModalContainer';
import SettingsBaseContainer from '../../containers/core/settings/SettingsBaseContainer';
import StatusPaneContainer from '../../containers/core/statuscard/StatusPaneContainer';
import OrderCodeContainer from '../../containers/core/statuscard/OrderCodeContainer';

export default class CoreBase extends Component {
  constructor(props) {
    super(props);
    this.coreHeaderHeight = 50;
    this.statusPaneStatus = "hidden";
    this.state = {
      coreContentHeight: this.calcCoreContentHeight(),
    };
  }

  componentWillMount() {
    const initialRouteName = this.props.cameFromSignUp ? "WelcomeToBarBud" : "VenueSearch";
    this.setState({currentRoute: initialRouteName});
    this.coreNavigator = StackNavigator(
      {
        WelcomeToBarBud: {screen: WelcomeToBarBud},
        VenueSearch: {screen: VenueSearchContainer},
        Venue: {screen: VenueContainer},
      },
      {
        initialRouteName,
        headerMode: 'none',
        navigationOptions: {
          gesturesEnabled: false,
       }
    });
  }

  componentDidMount() {
    Notifications.registerDeviceToUserIfHasNotificationPermission();
  }

  calcCoreContentHeight() {
    if (this.statusPaneStatus == 'hidden') {
      return height - this.coreHeaderHeight;
    } else {
      return height - StatusPaneHeight - this.coreHeaderHeight;
    }
  }

  updateCoreContentHeight() {
    this.setState({coreContentHeight: this.calcCoreContentHeight()})
  }

  onCoreHeaderHeightChange(coreHeaderHeight) {
    this.coreHeaderHeight = coreHeaderHeight;
    this.updateCoreContentHeight();
  }

  onStatusPaneStatusChange(statusPaneStatus) {
    this.statusPaneStatus = statusPaneStatus;
    this.updateCoreContentHeight();
  }

  promptUserToLeave() {
    this.venueComponent.requestGoBack();
  }

  userRespondedToModal(val) {
    if (val) {
      this.leave();
    }
    this.modal.dismiss()
  }

  registerVenueComponent(ref) {
    this.venueComponent = ref;
  }

  onNavigationStateChange(prevState, currentState) {
    const currentScreen = getCurrentRouteName(currentState);
    const prevScreen = getCurrentRouteName(prevState);
    if (prevScreen !== currentScreen) {
      this.props.changeSearchStatus(currentScreen == "VenueSearch");
      this.setState({currentRoute: currentScreen});
    }
  }

  render() {
    const CoreNavigator = this.coreNavigator;
    return (
      <View style={FillBackgroundWhite}>
        <SettingsBaseContainer />
        <CoreHeader
          venueName={this.props.venueName}
          searchPressed={this.promptUserToLeave.bind(this)}
          settingsPressed={this.props.openSettings}
          currentRoute={this.state.currentRoute}
          onHeight={this.onCoreHeaderHeightChange.bind(this)}/>
        <View style={{height: this.state.coreContentHeight}}>
          <CoreNavigator
            onNavigationStateChange={this.onNavigationStateChange.bind(this)}
            screenProps={{
              registerVenueComponent: this.registerVenueComponent.bind(this),
            }}/>
        </View>
        <View style={{height: 20, width: '100%', backgroundColor: 'white'}}/>
        <StatusPaneContainer 
          onStatusChange={this.onStatusPaneStatusChange.bind(this)}/>
        <DrinkModalContainer />
        <OrderCodeContainer/>
      </View>
    );
  }
}
