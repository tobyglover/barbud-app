import { connect } from 'react-redux';
import {addTipToOrder, clearTipApiStatus} from '../../../actions/Order'

import Tips from '../../../components/core/statuscard/Tips';

const mapStateToProps = (state, ownProps) => {
  return { 
    apiStatus: state.Order.apiStatus.tipOrder[ownProps.order.uuid],
  }

}

const mapDispatchToProps = dispatch => {
  return {
    addTipToOrder: (order, tipAmount) => dispatch(addTipToOrder(order, tipAmount)),
    clearAPIStatus: orderId => dispatch(clearTipApiStatus(orderId))
  };
}

const TipsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Tips);

export default TipsContainer;
