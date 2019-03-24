import { connect } from 'react-redux';
import {signUpUser} from './../../actions/SignUp';

import SignUp from '../../components/signed_out/signup/SignUp';

const mapStateToProps = state => {
  let isInvalid = false;
  for (let key in state.SignUpValidation.user) {
    isInvalid = isInvalid || Boolean(state.SignUpValidation.user[key]);
  }
  
  return {
    isInvalid,
    signUpApiStatus: state.SignUp.apiStatus.signUp,
    logInApiStatus: state.App.apiStatus.login
  };
}

const mapDispatchToProps = dispatch => {
  return {
    signUp: () => dispatch(signUpUser()),
  }
}

const SignUpBaseContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);

export default SignUpBaseContainer;
