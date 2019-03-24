import { connect } from 'react-redux';
import { closeSettings } from '../../../actions/App';

import SettingsBase from '../../../components/core/settings/SettingsBase';

const mapStateToProps = state => {
  return {
    visible: state.App.settings.openSettings
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onDismiss: () => dispatch(closeSettings()),
  }
}

const SettingsBaseContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsBase);

export default SettingsBaseContainer;
