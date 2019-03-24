import { connect } from 'react-redux';
import { drinkItemPressed, placeOrder, createOrder } from '../../../actions/Order';
import { getUserInfo } from '../../../actions/User';

import PendingOrder from '../../../components/core/statuscard/orderstatus/PendingOrder';

const mapStateToProps = state => {
  return {
    hasCard: state.App.settings.userInfo && Array.isArray(state.App.settings.userInfo.cards) && state.App.settings.userInfo.cards.length > 0,
    show: Object.keys(state.Order.pendingOrder.order).length > 0,
    order: state.Order.pendingOrder.orderData,
    apiStatus: {
      placeOrder: state.Order.apiStatus.placeOrder, 
      pendingOrder: state.Order.apiStatus.pendingOrder,
      cardCheck: state.App.apiStatus.userInfo}
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getUserInfo: () => dispatch(getUserInfo()),
    orderItemPressed: (item) => dispatch(drinkItemPressed(item)),
    placeOrder: () => dispatch(placeOrder()),
    resendOrder: () => dispatch(createOrder())
  };
}

const PendingOrderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PendingOrder);

export default PendingOrderContainer;
