import {
  ORDER_DRINK_ITEM_SELECTED,
  ORDER_ADD_SELECTED_ITEM_TO_ORDER,
  ORDER_CHANGE_QUANTITY_SELECTED_ITEM,
  API_CREATE_ORDER_LOADING,
  API_CREATE_ORDER_SUCCESS,
  API_CREATE_ORDER_ERROR,
  API_UPDATE_ORDER_LOADING,
  API_UPDATE_ORDER_SUCCESS,
  API_UPDATE_ORDER_ERROR,
  API_PLACE_ORDER_LOADING,
  API_PLACE_ORDER_SUCCESS,
  API_PLACE_ORDER_ERROR,
  API_PUT_TIP_ORDER_LOADING,
  API_PUT_TIP_ORDER_SUCCESS,
  API_PUT_TIP_ORDER_ERROR,
  API_PUT_TIP_ORDER_CLEAR,
  CHANGE_STATUS_OF_ORDER,
  SHOW_ORDER_CODE_MODAL} from '../statics/types';
import API, {
  postCreateOrder, 
  putUpdateOrder, 
  postUpdateOrderStatus,
  putTipToOrder,
  PatronOrderStatus} from '../helpers/API';
import {getUserOrderStatuses} from './User';

export const drinkItemPressed = (item) => {
  return {type: ORDER_DRINK_ITEM_SELECTED, payload: item};
};

export const addItemToOrder = () => {
  return {type: ORDER_ADD_SELECTED_ITEM_TO_ORDER};
};

export const modifyQuantityOfSelectedItem = (quantity) => {
  return {
    type: ORDER_CHANGE_QUANTITY_SELECTED_ITEM,
    payload: quantity
  };
};

export const createOrder = () => {
  return API(postCreateOrder, 
    {type: API_CREATE_ORDER_LOADING},
    (dispatch, getState, jsonResponse) => {
      dispatch({
        type: API_CREATE_ORDER_SUCCESS, 
        payload: jsonResponse});
    },
    {type: API_CREATE_ORDER_ERROR});
};

export const updateOrder = (item) => {
  return API(putUpdateOrder, 
    {type: API_UPDATE_ORDER_LOADING},
    (dispatch, getState, jsonResponse) => {
      dispatch({
        type: API_UPDATE_ORDER_SUCCESS, 
        payload: jsonResponse});
    },
    {type: API_UPDATE_ORDER_ERROR},
    true,
    item);
};

export const placeOrder = () => {
  return (dispatch, getState) => {
    const orderData = getState().Order.pendingOrder.orderData;
    dispatch(API(postUpdateOrderStatus, 
      {type: API_PLACE_ORDER_LOADING},
      (dispatch, getState, jsonResponse) => {
        dispatch({
          type: API_PLACE_ORDER_SUCCESS, 
          payload: jsonResponse});
        dispatch(changeOrderStatus(jsonResponse));
      },
      {type: API_PLACE_ORDER_ERROR},
      true, 
      {
        status: PatronOrderStatus.submit,
        orderId: orderData.uuid,
        barId: orderData.bar.uuid
      }))
  }
};

export const cancelOrder = (barId, orderId) => {
  return API(postUpdateOrderStatus, 
    null,
    (dispatch, getState, jsonResponse) => {
      dispatch(changeOrderStatus(jsonResponse));
    },
    null,
    true, 
    {
      status: PatronOrderStatus.cancel,
      orderId,
      barId
    })
};

export const addTipToOrder = (order, tipInCents) => {
  return API(putTipToOrder, 
    {type: API_PUT_TIP_ORDER_LOADING, payload: order.uuid},
    (dispatch) => {
      dispatch({type: API_PUT_TIP_ORDER_SUCCESS, payload: order.uuid})
      dispatch(getUserOrderStatuses([order.status]));
    },
    {type: API_PUT_TIP_ORDER_ERROR, payload: order.uuid},
    true, 
    {orderId: order.uuid, tipInCents, barId: order.bar.uuid})
};

export const clearTipApiStatus = orderId => {
  return {type: API_PUT_TIP_ORDER_CLEAR, payload: orderId}
}

export const changeOrderStatus = order => {
  return {type: CHANGE_STATUS_OF_ORDER, payload: order};
}

export const showOrderCodeModal = order => {
  return {type: SHOW_ORDER_CODE_MODAL, payload: order};
}

export const hideOrderCodeModal = () => {
  return {type: SHOW_ORDER_CODE_MODAL, payload: null};
}

