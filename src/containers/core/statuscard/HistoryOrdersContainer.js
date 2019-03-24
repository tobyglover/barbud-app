import { connect } from 'react-redux';

import HistoryOrders from '../../../components/core/statuscard/orderstatus/HistoryOrders';

const mapStateToProps = state => {
  return { 
    history: state.Order.history
  }

}

const mapDispatchToProps = dispatch => {
  return {
  };
}

const HistoryOrdersContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(HistoryOrders);

export default HistoryOrdersContainer;
