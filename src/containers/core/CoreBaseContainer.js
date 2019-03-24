import { connect } from 'react-redux';
import {changeSearchStatus} from '../../actions/Bar';
import {openSettings} from '../../actions/App'


import CoreBase from '../../components/core/CoreBase';

const mapStateToProps = (state) => {
  return {
    venueName: state.Bar.selectedVenue && state.Bar.selectedVenue.name,
    searchOpen: state.Bar.searchOpen,
    settingsOpen: state.App.settings.openSettings,
    pendingOrder: Object.keys(state.Order.pendingOrder.order).length > 0
  };
}

const mapDispatchToProps = dispatch => {
  return {
    openSettings: () => dispatch(openSettings()),
    changeSearchStatus: (isOpen) => dispatch(changeSearchStatus(isOpen))
  }
}

const CoreBaseContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CoreBase);

export default CoreBaseContainer;
