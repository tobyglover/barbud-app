import React, { PureComponent } from 'react';
import { 
  View} from 'react-native';

import DisclaimerContainer from '../../../containers/signup/DisclaimerContainer';

import {FillBackgroundWhite} from '../../../statics/styles';

export default class SettingsDisclaimer extends PureComponent {
  componentWillMount() {
    this.props.screenProps.registerGoBackCaller(this.props.navigation.goBack);
  }

  render() {
    return (
      <View style={FillBackgroundWhite}>
        <DisclaimerContainer />
      </View>
    );
  }
}
