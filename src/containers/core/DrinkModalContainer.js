import { connect } from 'react-redux';
import { 
  drinkItemPressed, 
  modifyQuantityOfSelectedItem, 
  addItemToOrder, 
  createOrder,
  updateOrder } from '../../actions/Order';

import DrinkModal from '../../components/core/Venue/DrinkModal';

const mapStateToProps = state => {
  const selectedDrink = state.Order.selectedDrink;
  if (!selectedDrink) {
    return {show: false};
  }
  return {
    show: true,
    drink: selectedDrink.item,
    quantity: selectedDrink.quantity,
    isInOrder: selectedDrink.isInOrder,
    hasPendingOrder: Boolean(state.Order.pendingOrder.orderData.uuid)
  } 
}

const mapDispatchToProps = dispatch => {
  return {
    dismiss: () => dispatch(drinkItemPressed(null)),
    modifyQuantityItem: (quantity) => dispatch(modifyQuantityOfSelectedItem(quantity)),
    addToOrder: () => dispatch(addItemToOrder()),
    createOrder: () => dispatch(createOrder()),
    updateOrder: (item) => dispatch(updateOrder(item)),
  };
}

const DrinkModalContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DrinkModal);

export default DrinkModalContainer;
