import { connect } from 'react-redux';
import {addCardToUser, resetPaymentApiStatus} from './../../actions/SignUp';

import SignUpPaymentInfo from '../../components/signed_out/signup/SignUpPaymentInfo';

const mapStateToProps = state => {
  return {
    apiStatus: state.SignUp.apiStatus.addCard
  };
}

const mapDispatchToProps = dispatch => {
  return {
    addCardToUser: card => dispatch(addCardToUser(card)),
    resetApiStatus: () => dispatch(resetPaymentApiStatus())
  }
}

const SignUpPaymentInfoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpPaymentInfo);

export default SignUpPaymentInfoContainer;
