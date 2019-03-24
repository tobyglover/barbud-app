import React, { Component } from 'react';
import { 
  View,
  Image, 
  StyleSheet,
  ActivityIndicator} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import SignedOutScreenBase from './SignedOutScreenBase';
import TextInputWithLabel from '../widgets/TextInputWithLabel';
import Button from '../widgets/Button';
import T from '../widgets/T';
import Modal from '../widgets/Modal';
import LoadingIndicator from '../widgets/LoadingIndicator';
import {orange} from '../../statics/colors';
import {isInvalidEmail} from '../../helpers/Validation';
import WindowDimensions from '../../helpers/WindowDimensions';

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  contentContainer: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageContainer: {
    paddingTop: WindowDimensions.height * .2,
    alignItems: 'center',
    flexDirection: 'column',
  },
  inputContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 5
  },
  fullWidth: {
    width: '100%'
  },
  forgotPasswordButtonContainer: {
    alignItems: 'flex-end',
    marginRight: 5,
    marginBottom: 20
  },
  forgotPasswordText: {
    color: orange,
  },
  forgotPasswordContainer: {
    width: '100%'
  }
});

const size = 100;

export default class LogInScreen extends Component {
  constructor(props) {
    super(props);
    this.logIn = this.logIn.bind(this);
    this.state = {showModal: false, hasCode: false, validationCode: ''};
  }

  componentWillMount() {
    this.props.onChangePassword("");
  }

  componentWillReceiveProps(nextProps) {
    this.setState({hasCode: typeof nextProps.validationCodeApiStatus == 'object'})
  }

  logIn() {
    this.props.logIn();
  }

  forgotPasswordModalDismissed() {
    this.setState({showModal: false, hasCode: false});
    this.props.onChangePassword("");
  }

  validationCodeChanged(validationCode) {
    this.setState({validationCode});
  }

  resetPassword() {
    this.props.resetPassword(this.state.validationCode);
  }
  
  emailTextInput(borderColor, onSubmitEditing) {
    return <TextInputWithLabel
            borderColor={borderColor}
            label="Email"
            onChangeText={this.props.onChangeEmail}
            value={this.props.email}
            onSubmitEditing={onSubmitEditing}
            hideValidationMessage={true}
            textInputProps={{keyboardType: 'email-address',
                             autoCapitalize: 'none',
                             autoCorrect: false,
                             returnKeyType: 'done',
                             editable: this.props.resetPasswordApiStatus !== 'loading' && 
                                       this.props.validationCodeApiStatus !== 'loading' &&
                                       this.props.apiStatus !== 'loading'}}/>;
  }

  passwordTextInput(borderColor, label, onSubmitEditing) {
    return <TextInputWithLabel
            ref={(r) => this.passwordInput = r}
            label={label}
            borderColor={borderColor}
            value={this.props.password}
            onSubmitEditing={onSubmitEditing}
            onChangeText={this.props.onChangePassword}
            hideValidationMessage={true}
            textInputProps={{secureTextEntry: true,
                             autoCorrect: false,
                             autoCapitalize: 'none',
                             returnKeyType: 'done'}}/>
  }

  renderForgotPasswordModal() {
    let contents = null;
    const loadingIndicator =
      <View style={{alignItems: 'center'}}>
        <ActivityIndicator />
      </View>;
    let submitButton = 
      <Button 
        text="Reset Password"
        disabled={!this.props.password || isInvalidEmail(this.props.email) || !this.state.validationCode}
        onPress={this.resetPassword.bind(this)}/>
    if (this.props.resetPasswordApiStatus == 'error') {
      submitButton = 
      <View>
        <T style={{textAlign: 'center', color: 'red'}}>Invalid email or validation code</T>
        {submitButton}
      </View>
    } else if (this.props.resetPasswordApiStatus == 'loading') {
      submitButton = loadingIndicator;
    }

    if (this.state.hasCode) {
      contents = 
        <View style={Styles.forgotPasswordContainer}>
          {typeof this.props.validationCodeApiStatus == 'object' && this.props.validationCodeApiStatus.defaultContactMethod && 
          <T type="h3" style={{textAlign: 'center'}}>A validation code has been sent to the {this.props.validationCodeApiStatus.defaultContactMethod} associated with your account</T>}
          
          {this.emailTextInput("black")}
          <TextInputWithLabel
            borderColor="black"
            label="Validation Code"
            onChangeText={this.validationCodeChanged.bind(this)}
            value={this.state.validationCode}
            hideValidationMessage={true}
            textInputProps={{autoCapitalize: 'none',
                             autoCorrect: false,
                             returnKeyType: 'next'}}/>
          {this.passwordTextInput("black", "New Password", this.resetPassword.bind(this))}
          {submitButton}
        </View>
    } else {
      contents = 
        <View style={Styles.forgotPasswordContainer}>
          <T type="h2" style={{textAlign: 'center', marginBottom: 10}}>Enter the email associated with your account</T>
          {this.emailTextInput("black", this.props.getValidationCode)}
          {this.props.validationCodeApiStatus === 'loading' ? 
            loadingIndicator :
            <View>
              {this.props.validationCodeApiStatus === 'error' && <T style={{textAlign: 'center', color: 'red'}}>Invalid email</T>}
              <Button 
                text="Submit"
                disabled={isInvalidEmail(this.props.email)}
                onPress={this.props.getValidationCode}/>
              <Button 
                text="I already have a validation code"
                type="text"
                textProps={{style: {fontSize: 18}}}
                onPress={() => this.setState({hasCode: true})}/>
          </View>}
        </View>;
    }

    return (
      <Modal
        visible={this.state.showModal}
        dismissable={true}
        animate={true}
        onDismiss={this.forgotPasswordModalDismissed.bind(this)}
        scrollable={true}>
        {contents}
      </Modal>
    );
  }

  render() {
    const invalid = this.props.email == '' || this.props.password == '' ||
                    isInvalidEmail(this.props.email);
    const loading = this.props.apiStatus == 'loading' && <LoadingIndicator text="Logging in"/>;
    const errorMsg = this.props.apiStatus == 'error' && 
                    <T type="h3" style={{color: 'red'}}>Invalid Email or Password</T>;
    return (
      <SignedOutScreenBase
        onBackPressed={() => this.props.navigation.goBack()}>
        <View style={Styles.container}>
          <View style={Styles.contentContainer}>
            <KeyboardAwareScrollView style={Styles.fullWidth}>
              <View style={Styles.imageContainer}>
                <Image 
                  style={{width: size, height: size}}
                  source={require('../../statics/images/beer_glass.png')}
                  resizeMode="contain"/>
              </View>
              <View style={Styles.inputContainer}>
                {errorMsg}
                <View style={Styles.fullWidth}>
                  {this.emailTextInput('white', () => this.passwordInput.focus())}
                  {this.passwordTextInput('white', "Password", this.logIn)}
                  <Button
                    containerStyle={Styles.forgotPasswordButtonContainer}
                    textProps={{style: Styles.forgotPasswordText}}
                    type="text"
                    text="Forgot Password?"
                    onPress={() => this.setState({showModal: true})}/>
                </View>        
              </View>
              <Button 
                  text="Log In"
                  disabled={invalid}
                  onPress={this.logIn}/>  
            </KeyboardAwareScrollView>
            {loading}
            {this.renderForgotPasswordModal()}
          </View>
        </View>
      </SignedOutScreenBase>
    );
  }
}
