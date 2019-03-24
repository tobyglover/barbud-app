import { connect } from 'react-redux';
import {showOrderCodeModal} from '../../../actions/Order';

import CompletedOrders from '../../../components/core/statuscard/orderstatus/CompletedOrders';

const mapStateToProps = state => {
  return { 
    completedOrders: state.Order.completedOrders
  }

}

const mapDispatchToProps = dispatch => {
  return {
    showOrderCodeModal: (order) => dispatch(showOrderCodeModal(order))
  };
}

const CompletedOrdersContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CompletedOrders);

export default CompletedOrdersContainer;
