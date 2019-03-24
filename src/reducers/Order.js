import {
  ORDER_ADD_SELECTED_ITEM_TO_ORDER,
  ORDER_DRINK_ITEM_SELECTED,
  ORDER_CHANGE_QUANTITY_SELECTED_ITEM,
  VENUE_SEARCH_STATUS,
  BAR_SELECTED_FROM_VENUE,
  API_CREATE_ORDER_LOADING,
  API_CREATE_ORDER_SUCCESS,
  API_CREATE_ORDER_ERROR,
  API_UPDATE_ORDER_LOADING,
  API_UPDATE_ORDER_SUCCESS,
  API_UPDATE_ORDER_ERROR,
  API_PLACE_ORDER_LOADING,
  API_PLACE_ORDER_SUCCESS,
  API_PLACE_ORDER_ERROR,
  USER_LOG_OUT,
  API_GET_USER_ORDER_STATUSES_LOADING,
  API_GET_USER_ORDER_STATUSES_ERROR,
  API_GET_USER_ORDER_STATUSES_SUCCESS,
  API_PUT_TIP_ORDER_LOADING,
  API_PUT_TIP_ORDER_SUCCESS,
  API_PUT_TIP_ORDER_ERROR,
  API_PUT_TIP_ORDER_CLEAR,
  CHANGE_STATUS_OF_ORDER,
  SHOW_ORDER_CODE_MODAL} from '../statics/types';

import {PatronOrderStatus, BartenderOrderStatus} from '../helpers/API';

const initialState = {
  selectedDrink: null,
  showOrderCode: null,
  pendingOrder: {
    order: {},
    orderData: {}
  },
  apiStatus: {
    pendingOrder: '',
    getOrderStatus: '',
    placeOrder: '',
    tipOrder: {}
  },
  currentOrders: [],
  completedOrders: [],
  history: [],
  makingOrders: []
}

const STATUSES_TO_KEYS = {}
      STATUSES_TO_KEYS[PatronOrderStatus.submit] = "currentOrders";
      STATUSES_TO_KEYS[BartenderOrderStatus.making] = "makingOrders";
      STATUSES_TO_KEYS[BartenderOrderStatus.made] = "completedOrders";
      STATUSES_TO_KEYS[BartenderOrderStatus.delivered] = "history";

const Order = (state = initialState, action) => {
  let newState = null;
  switch (action.type) {
    case ORDER_DRINK_ITEM_SELECTED:
      if (action.payload) {
        const drink = state.pendingOrder.order[action.payload.uuid];
        const quantity = drink ? drink.quantity : 0;
        return {
          ...state,
          selectedDrink: {
            item: action.payload, 
            quantity: quantity,
            isInOrder: Boolean(drink)
          }
        };
      } else {
        return {...state, selectedDrink: null};
      }
    case ORDER_CHANGE_QUANTITY_SELECTED_ITEM:
      return {
        ...state,
        selectedDrink: {
          ...state.selectedDrink,
          quantity: action.payload >= 0 ? action.payload : 0
        }
      }
    case ORDER_ADD_SELECTED_ITEM_TO_ORDER:
      let newOrder = {...state.pendingOrder.order};
      if (state.selectedDrink.quantity > 0) {
        newOrder[state.selectedDrink.item.uuid] = {...state.selectedDrink};
      } else if (state.pendingOrder.order[state.selectedDrink.item.uuid]) {
        delete newOrder[state.selectedDrink.item.uuid];
      }
      return {
          ...state,
          pendingOrder: {
            ...state.pendingOrder,
            order: newOrder
          }
        }
    case BAR_SELECTED_FROM_VENUE:
    case VENUE_SEARCH_STATUS:
      return {
        ...state,
        pendingOrder: {...initialState.pendingOrder}
      };
    case API_UPDATE_ORDER_LOADING:
    case API_CREATE_ORDER_LOADING: 
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          pendingOrder: 'loading'
        }
      }
    case API_UPDATE_ORDER_SUCCESS:
    case API_CREATE_ORDER_SUCCESS: 
      return {
        ...state,
        pendingOrder: {
          ...state.pendingOrder,
          orderData: action.payload,
        },
        apiStatus: {
          ...state.apiStatus,
          pendingOrder: 'success'
        }
      }
    case API_UPDATE_ORDER_ERROR:
    case API_CREATE_ORDER_ERROR: 
      return {
        ...state,
        pendingOrder: {
          ...state.pendingOrder,
          orderData: initialState.pendingOrder.orderData
        },
        apiStatus: {
          ...state.apiStatus,
          pendingOrder: 'error'
        }
      }
    case API_GET_USER_ORDER_STATUSES_LOADING:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          getOrderStatus: 'loading'
        }
      }
    case API_GET_USER_ORDER_STATUSES_ERROR:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          getOrderStatus: 'error'
        }
      }
    case API_GET_USER_ORDER_STATUSES_SUCCESS:
      const newStatuses = {};
      action.payload.statuses.map(value => {
        newStatuses[STATUSES_TO_KEYS[value]] = [];
      });
      if (Array.isArray(action.payload.response)) {
        action.payload.response.map(value => {
          newStatuses[STATUSES_TO_KEYS[value.status]].push(value);
        });
      }
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          getOrderStatus: 'success'
        },
        ...newStatuses
      }
    case API_PLACE_ORDER_LOADING:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          placeOrder: 'loading'
        }
      }
    case API_PLACE_ORDER_SUCCESS:
      return {
        ...state,
        pendingOrder: {
          ...initialState.pendingOrder
        },
        apiStatus: {
          ...state.apiStatus,
          placeOrder: 'success'
        }
      }
    case API_PLACE_ORDER_ERROR:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          placeOrder: 'error'
        }
      }
    case API_PUT_TIP_ORDER_LOADING:
      newState = {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          tipOrder: {
            ...state.apiStatus.tipOrder,
          }
        }
      }
      newState.apiStatus.tipOrder[action.payload] = 'loading';
      return newState;
    case API_PUT_TIP_ORDER_SUCCESS:
      newState = {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          tipOrder: {
            ...state.apiStatus.tipOrder,
          }
        }
      }
      newState.apiStatus.tipOrder[action.payload] = 'success';
      return newState;
    case API_PUT_TIP_ORDER_ERROR:
      newState = {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          tipOrder: {
            ...state.apiStatus.tipOrder,
          }
        }
      }
      newState.apiStatus.tipOrder[action.payload] = 'error';
      return newState;
    case API_PUT_TIP_ORDER_CLEAR:
      newState = {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          tipOrder: {
            ...state.apiStatus.tipOrder,
          }
        }
      }
      newState.apiStatus.tipOrder[action.payload] = '';
      return newState;
    case CHANGE_STATUS_OF_ORDER: 
      return moveOrderToNewStatus(state, action.payload);
    case SHOW_ORDER_CODE_MODAL: 
      return {
        ...state,
        showOrderCode: action.payload
      }
    case USER_LOG_OUT: 
      return {...initialState};
    default:
      return state
  }
}

function removeOrderFromState(newState, order) {
  let removedOrder = false;
  let statuses = Object.keys(STATUSES_TO_KEYS).filter(value => value != BartenderOrderStatus.delivered && value != order.previousStatus);
  statuses.unshift(order.previousStatus);

  for (let i = 0; i < statuses.length; i++) {
    const status = statuses[i];
    const previousStatusArray = newState[STATUSES_TO_KEYS[status]];
    let foundOrder = false;

    const newStatusArray = previousStatusArray.filter(value => {
      const isOrder = value.uuid == order.uuid;
      if (isOrder) {
        foundOrder = true;
        // console.log("@@@@ HERE");
        // console.log(value.statusUpdatedAt);
        // console.log(order.statusUpdatedAt);
        // removedOrder = moment(value.statusUpdatedAt).isBefore(moment(order.statusUpdatedAt));
        removedOrder = true;
        // console.log(removedOrder);
      }
      return !(removedOrder && isOrder);
    });

    if (foundOrder) {
      if (removedOrder) {
        newState[STATUSES_TO_KEYS[status]] = newStatusArray;
      }
      break;
    }
  }

  return {newState, removedOrder};
}

function addOrderToState(newState, order) {
  const newStatusArray = newState[STATUSES_TO_KEYS[order.status]].slice();
  newStatusArray.unshift(order);
  newState[STATUSES_TO_KEYS[order.status]] = newStatusArray;
  return newState;
}

function moveOrderToNewStatus(state, order) {
  let newState = {...state};
  let removedOrder = true;

  if (order.previousStatus && STATUSES_TO_KEYS[order.previousStatus]) {
    const data = removeOrderFromState(newState, order);
    newState = data.newState;
    removedOrder = data.removedOrder;
  }
  if (order.status && STATUSES_TO_KEYS[order.status] && removedOrder) {
    newState = addOrderToState(newState, order);
  }
  
  return newState;
}

export default Order;




