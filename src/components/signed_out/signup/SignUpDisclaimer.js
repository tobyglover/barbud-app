// displays disclaimer and checkbox for the user to agree

import React, { Component } from 'react';

import SignedOutScreenBase from '../SignedOutScreenBase';
import DisclaimerContainer from '../../../containers/signup/DisclaimerContainer';

export default class SignUpDisclaimer extends Component {
  render() {
    return (
      <SignedOutScreenBase
        onBackPressed={() => this.props.navigation.goBack()}
        headerText="Terms and Conditions">
        <DisclaimerContainer 
          textColor="white"/>
      </SignedOutScreenBase>
    );
  }
}
