import { connect } from 'react-redux';
import {
  changeUserInfo, 
  resetNewUserInfo,
  sendUserInfoChanges,
  resetApiNewUserInfo} from '../../../actions/Settings';

import SettingsUser from '../../../components/core/settings/SettingsUser';

const mapStateToProps = state => {
  let isValid = true;
  let buttonEnabled = false;

  for (let key in state.App.settings.newUserInfoValidation) {
    isValid = isValid && !state.App.settings.newUserInfoValidation[key];
  }
  if (isValid) { 
    for (let key in state.App.settings.newUserInfo) {
      buttonEnabled = buttonEnabled ||
                       Boolean(state.App.settings.newUserInfo[key]);
    }
  }

  return {
    userInfo: state.App.settings.userInfo,
    newUserInfo: state.App.settings.newUserInfo,
    newUserInfoValidation: state.App.settings.newUserInfoValidation,
    invalidPassword: state.App.user.password !== state.App.settings.newUserInfo.currentPassword,
    apiStatus: state.App.apiStatus.newUserInfo,
    buttonEnabled 
  }
}

const mapDispatchToProps = dispatch => {
  return {
    resetNewUserInfo: () => dispatch(resetNewUserInfo()),
    onChangeUserInfo: (key, value) => dispatch(changeUserInfo(key, value)),
    sendUserInfoChanges: () => dispatch(sendUserInfoChanges()),
    dismissApiStatus: () => dispatch(resetApiNewUserInfo())
  }
}

const SettingsUserContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsUser);

export default SettingsUserContainer;
