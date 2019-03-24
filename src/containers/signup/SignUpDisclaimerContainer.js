// Container for SignUpDisclaimer component

import { connect } from 'react-redux';
import { changeCheckbox } from './../../actions/SignUp';

import SignUpDisclaimer from '../../components/signed_out/signup/SignUpDisclaimer';

const mapStateToProps = state => {
  return {
    isOnScreen: state.SignUp.currentProgress == 2,
    disclaimerAccepted: state.SignUp.disclaimer.accepted,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onCheckboxChanged: () => {
      dispatch(changeCheckbox())
    },
  }
}

const SignUpDisclaimerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpDisclaimer);

export default SignUpDisclaimerContainer;
