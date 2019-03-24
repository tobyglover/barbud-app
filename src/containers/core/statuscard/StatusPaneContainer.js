import { connect } from 'react-redux';

import {getUserOrderStatuses} from '../../../actions/User';

import StatusPane from '../../../components/core/statuscard/StatusPane';

const mapStateToProps = state => {
  const currentOrdersQuantity = state.Order.currentOrders.length;
  const completedOrdersQuantity = state.Order.completedOrders.length;
  const orderHistoryQuantity = state.Order.history.length;
  const makingOrdersQuantity = state.Order.makingOrders.length;
  let pendingOrderQuantity = 0;
  for (let key in state.Order.pendingOrder.order) {
    pendingOrderQuantity += state.Order.pendingOrder.order[key].quantity
  }
  const shouldHide = !(pendingOrderQuantity || currentOrdersQuantity || completedOrdersQuantity || orderHistoryQuantity || makingOrdersQuantity);
  return {
    pendingOrderQuantity,
    currentOrdersQuantity,
    completedOrdersQuantity,
    orderHistoryQuantity,
    makingOrdersQuantity,
    shouldHide,
    apiStatus: state.Order.apiStatus.getOrderStatus
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getUserOrderStatuses: () => dispatch(getUserOrderStatuses())
  };
}

const StatusPaneContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StatusPane);

export default StatusPaneContainer;
