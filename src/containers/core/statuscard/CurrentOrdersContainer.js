import { connect } from 'react-redux';

import CurrentOrders from '../../../components/core/statuscard/orderstatus/CurrentOrders';
import {cancelOrder} from '../../../actions/Order';

const mapStateToProps = state => {
  return { 
    currentOrders: state.Order.currentOrders
  }

}

const mapDispatchToProps = dispatch => {
  return {
    cancelOrder: (barId, orderId) => dispatch(cancelOrder(barId, orderId))
  };
}

const CurrentOrdersContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentOrders);

export default CurrentOrdersContainer;
