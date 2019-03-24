import { connect } from 'react-redux';
import {hideOrderCodeModal} from '../../../actions/Order';

import OrderCode from '../../../components/core/statuscard/orderstatus/OrderCode';

const mapStateToProps = state => {
  return { 
    order: state.Order.showOrderCode,
    visible: state.Order.showOrderCode != null
  }

}

const mapDispatchToProps = dispatch => {
  return {
    onDismiss: () => dispatch(hideOrderCodeModal())
  };
}

const OrderCodeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderCode);

export default OrderCodeContainer;
