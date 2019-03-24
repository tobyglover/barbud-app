import { connect } from 'react-redux';

import {checkBetaCode} from '../actions/App';
import BetaCode from '../components/signed_out/BetaCode';

const mapStateToProps = state => {
  return {
    show: !state.App.user.isBetaUser,
    apiStatus: state.App.apiStatus.betaCode
  }
}

const mapDispatchToProps = dispatch => {
  return {
    checkBetaCode: (code) => dispatch(checkBetaCode(code))
  }
}

const BetaCodeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(BetaCode);

export default BetaCodeContainer;
