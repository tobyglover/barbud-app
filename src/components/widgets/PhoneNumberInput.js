// Gets phone number from user

import React, { Component } from 'react';
import {View} from 'react-native';
import TextInputWithLabel from './TextInputWithLabel';

export default class PhoneNumberInput extends Component {
  constructor(props) {
    super(props);
    this.numberChanged = this.numberChanged.bind(this);
    this.state = {showOptional: true};
  }

  formatNumber(phoneNumber) {
    phoneNumber = phoneNumber ? phoneNumber.split('') : [];
    if (phoneNumber.length > 0) {
      phoneNumber.splice(0, 0, '(');
    }
    if (phoneNumber.length > 4) {
      phoneNumber.splice(4, 0, ')'); 
    }
    if (phoneNumber.length > 5) {
      phoneNumber.splice(5, 0, ' ');
    }
    if (phoneNumber.length > 9) {
      phoneNumber.splice(9, 0, '-');
    }
    return phoneNumber.join('');
  }

  numberChanged(formattedPhoneNumber) {
    const phoneNumber = formattedPhoneNumber.replace(/\D/g, '');
    this.props.onChangeNumber(phoneNumber);
  }

  focus() {
    this.textInput.focus();
  }

  render() {
    const textInputProps = {
      returnKeyType:'next',
      ...this.props.textInputProps,
      keyboardType:'numeric',
      maxLength: 14
    };
    return (
      <View>
        <TextInputWithLabel
          activeLabelColor={this.props.activeLabelColor}
          borderColor={this.props.borderColor}
          ref={(r) => this.textInput = r}
          label="Phone number"
          value={this.formatNumber(this.props.value)}
          onChangeText={this.numberChanged}
          textInputProps={textInputProps}
          validationMessage={this.props.validationMessage}
          showOptional={true}/>
      </View>
      );
  }
}
