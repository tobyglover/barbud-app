import { connect } from 'react-redux';
import { logoutUser, getUserInfo } from '../../../actions/User';
import { setShouldUseStaging } from '../../../actions/App';

import SettingsHome from '../../../components/core/settings/SettingsHome';

const mapStateToProps = state => {
  return {
    apiStatus: state.App.apiStatus.userInfo,
    userInfo: state.App.settings.userInfo,
    useStaging: state.App.persistentSettings.useStaging
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getUserInfo: () => dispatch(getUserInfo()),
    logout: () => dispatch(logoutUser()),
    setShouldUseStaging: (value) => dispatch(setShouldUseStaging(value))
  }
}

const SettingsHomeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsHome);

export default SettingsHomeContainer;
