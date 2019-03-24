import React, { Component } from 'react';
import { 
  View,
  StyleSheet,
  TouchableOpacity} from 'react-native';

import SignedOutScreenBase from '../SignedOutScreenBase'
import T from '../../widgets/T';
import Button from '../../widgets/Button';
import Modal from '../../widgets/Modal';
import LoadingIndicator from '../../widgets/LoadingIndicator';

import SignUpPersonalInfoContainer from '../../../containers/signup/SignUpPersonalInfoContainer';

const Styles = StyleSheet.create({
  infoContainer: {
    flex: 1,
    marginTop: 20
  },
  nextButtonContainer: {
    padding: 10,
    alignItems: 'center',
    width: '100%',
  },
  termsAndConditionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  termsAndConditionsText: {
    color: 'white',
    textAlign: 'center'
  }
});

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.showedSignUpError = false;
    this.showedLogInError = false;
    this.state = {
      showError: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.signUpApiStatus == "error" && !this.showedSignUpError) {
      this.setState({showError: "signup"});
      this.showedSignUpError = true;
    } 

    if (nextProps.logInApiStatus == "error" && !this.showedLogInError) {
      this.setState({showError: "login"});
      this.showedLogInError = true;
    }
  }

  goBack() {
    this.props.navigation.goBack();
  }

  renderErrorModal() {
    let message = "";
    let title = "";

    if (this.state.showError === "signup") {
      title = "Error Signing Up";
      message = "There was an error signing up. Please check your details and try again.";
    } else if (this.state.showError == "login") {
      title = "Error Logging In";
      message = "There was an error logging you in. However, you have been successfully signed up!";
    }

    return (
      <Modal
        ref={(r) => this.modal = r}
        visible={Boolean(this.state.showError)}
        dismissable={true}
        animate={true}
        title={title}
        onDismiss={() => this.setState({showError: false})}>
        <T type="h2" style={{textAlign: 'center'}}>{message}</T>
        <Button
          text="Ok"
          onPress={() => this.modal.dismiss()}/>  
      </Modal>
    );
  }

  render() {
    const loadingIndicator = 
        this.props.signUpApiStatus == "loading" ? 
          <LoadingIndicator text="Signing Up"/> : 
        this.props.logInApiStatus == "loading" ?
          <LoadingIndicator text="Logging In"/> : null;
    return (
      <SignedOutScreenBase
        onBackPressed={this.goBack.bind(this)}
        headerText="Sign Up">
        <View style={Styles.infoContainer}>
          <SignUpPersonalInfoContainer />
        </View>
        <View style={Styles.nextButtonContainer}>
          <Button
            text="Sign Up"
            disabled={this.props.isInvalid}
            onPress={this.props.signUp}/>
          <View style={Styles.termsAndConditionsContainer}>
            <T style={Styles.termsAndConditionsText}>By clicking Sign Up you agree to BarBud's</T>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("SignUpDisclaimer")}>
              <T style={Styles.termsAndConditionsText} underline>Terms and Conditions</T>
            </TouchableOpacity>
          </View>
        </View>
        {loadingIndicator}
        {this.renderErrorModal()}
      </SignedOutScreenBase>
    );
  }
}
