import { connect } from 'react-redux';

import LogInScreen from '../components/signed_out/LogInScreen';
import {
  logInPasswordChanged, 
  logInEmailChanged, 
  logInUser,
  getValidationCode,
  resetPassword} from '../actions/User';

const mapStateToProps = state => {
  return {
    email: state.App.user.email,
    password: state.App.user.password,
    apiStatus: state.App.apiStatus.login,
    validationCodeApiStatus: state.App.apiStatus.validationCode,
    resetPasswordApiStatus: state.App.apiStatus.resetPassword
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onChangeEmail: (email) => dispatch(logInEmailChanged(email)),
    onChangePassword: (password) => dispatch(logInPasswordChanged(password)),
    logIn: () => dispatch(logInUser()),
    getValidationCode: () => dispatch(getValidationCode()),
    resetPassword: (validationCode) => dispatch(resetPassword(validationCode))
  }
}

const LogInScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LogInScreen);

export default LogInScreenContainer;
