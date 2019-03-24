import {changeOrderStatus, showOrderCodeModal} from '../../../actions/Order'
import {BartenderOrderStatus} from '../../API';

const parse = (store, notification) => {
  const order = notification.payload.additionalData.data;
  store.dispatch(changeOrderStatus(order));
  if (order.status == BartenderOrderStatus.made) {
    store.dispatch(showOrderCodeModal(order));
  }
}

module.exports = {
  parse
}