// Container for SignUpPersonalInfo component

import { connect } from 'react-redux';
import {
  changeName, 
  changeEmail, 
  changePassword, 
  changePhone, 
  changeDOB} from './../../actions/SignUp';

import SignUpPersonalInfo from '../../components/signed_out/signup/SignUpPersonalInfo';

const mapStateToProps = state => {
  return {user: state.SignUp.user, validation: state.SignUpValidation.user};
}

const mapDispatchToProps = dispatch => {
  return {
    onChangeName: name => {
      dispatch(changeName(name))
    },
    onChangeEmail: email => {
      dispatch(changeEmail(email))
    },
    onChangePassword: password => {
      dispatch(changePassword(password))
    },
    onChangePhoneNumber: phone => {
      dispatch(changePhone(phone))
    },
    onChangeDOB: dob => {
      dispatch(changeDOB(dob))
    },
  }
}

const SignUpPersonalInfoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpPersonalInfo);

export default SignUpPersonalInfoContainer;
