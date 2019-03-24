// Container for SignUpDisclaimer component

import { connect } from 'react-redux';
import { fetchDisclaimer } from './../../actions/SignUp';

import Disclaimer from '../../components/signed_out/signup/Disclaimer';

const mapStateToProps = state => {
  return {
    disclaimerAPIStatus: state.SignUp.apiStatus.disclaimer,
    disclaimer: state.SignUp.disclaimer
  };
}

const mapDispatchToProps = dispatch => {
  return {
    fetchDisclaimer: () => {
      dispatch(fetchDisclaimer())
    }
  }
}

const DisclaimerContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Disclaimer);

export default DisclaimerContainer;
