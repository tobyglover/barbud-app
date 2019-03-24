import { connect } from 'react-redux';

import {changeNetworkErrorStatus, changeAuthErrorStatus} from '../actions/App';
import App from '../components/App';

const mapStateToProps = state => {
  return {
    usingStaging: state.App.persistentSettings.useStaging,
    isLoggedIn: state.App.user.email && state.App.user.password && state.App.authToken,
    networkError: state.App.apiStatus.network,
    authError: state.App.apiStatus.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dismissNetworkError: () => dispatch(changeNetworkErrorStatus(false)),
    dismissAuthError: () => dispatch(changeAuthErrorStatus(false))
  }
}

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default AppContainer;
