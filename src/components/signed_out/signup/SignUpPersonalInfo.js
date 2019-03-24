// Gets Personal information (Name, email, etc.) from user during signup

import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import TextInputWithLabel from '../../widgets/TextInputWithLabel';
import PhoneNumberInput from '../../widgets/PhoneNumberInput';
import DateInput from '../../widgets/DateInput';

const Styles = StyleSheet.create({
  container: {
    flex: .8,
    justifyContent: 'flex-start'
  },
  PhoneDateContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  phoneDateItem: {
    flex: 1
  }
});

export default class SignUpPersonalInfo extends Component {
  componentWillMount() {
    this.inputs = [];
  }

  render() {
    return (
      <KeyboardAwareScrollView
        keyboardOpeningTime={150}>
        <View style={Styles.container}>
          <TextInputWithLabel
            ref={(r) => this.inputs[0] = r}
            label="Name"
            value={this.props.user.name}
            validationMessage={this.props.validation.name}
            onChangeText={this.props.onChangeName}
            onSubmitEditing={() => this.inputs[1].focus()}
            textInputProps={{autoCapitalize:'words',
                             returnKeyType:'next'}}/>
          <TextInputWithLabel
            ref={(r) => this.inputs[1] = r}
            label="Email"
            value={this.props.user.email}
            validationMessage={this.props.validation.email}
            onChangeText={this.props.onChangeEmail}
            onSubmitEditing={() => this.inputs[2].focus()}
            textInputProps={{keyboardType:'email-address',
                             autoCapitalize: 'none',
                             autoCorrect: false,
                             returnKeyType:'next'}}/>
          <TextInputWithLabel
            ref={(r) => this.inputs[2] = r}
            label="Password"
            value={this.props.user.password}
            validationMessage={this.props.validation.password}
            onChangeText={this.props.onChangePassword}
            onSubmitEditing={() => this.inputs[3].focus()}
            textInputProps={{secureTextEntry:true,
                             returnKeyType:'next'}}/>
          <View style={Styles.PhoneDateContainer}>
            <View style={Styles.phoneDateItem}>
              <PhoneNumberInput
                ref={(r) => this.inputs[3] = r}
                value={this.props.user.phone}
                validationMessage={this.props.validation.phone}
                onChangeNumber={this.props.onChangePhoneNumber} />
            </View>
            <View style={Styles.phoneDateItem}>
              <DateInput
                validationMessage={this.props.validation.dateOfBirth}
                value={this.props.user.dateOfBirth}
                onChangeDate={this.props.onChangeDOB}/>
            </View>          
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
