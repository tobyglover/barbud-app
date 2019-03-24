/* Generic wrapper for making an api request. fetchRequest must be a function
   that returns a fetch() object. before and onError can either be functions
   that accept (dispatch, getState) or they can be objects that will be
   dispatched automatically. onSuccess must be a function that accepts
   (dispatch, getState, jsonResponse). */
import {NetInfo} from 'react-native';
import {
  changeNetworkErrorStatus,
  changeAuthErrorStatus,
  updateAuthToken} from '../actions/App';
import Locations from '../helpers/Locations';

let isConnected = true;

NetInfo.isConnected.addEventListener(
  'connectionChange',
  connectionChange => isConnected = connectionChange
);

function checkConnection() {
  NetInfo.isConnected.fetch().then(connectionChange => isConnected = connectionChange);
}

setInterval(checkConnection, 60000);

// Errors
const ERRORS = {
  GENERAL: -1,
  AUTH_ERROR: 0
};

const DOMAIN_BASE = "http://localhost:3000/api/v1/";
// const DOMAIN_BASE = "https://api.getbarbud.com/api/v1/";
const STAGING_DOMAIN_BASE = "https://barbud-api-staging.herokuapp.com/api/v1/"
const USERS = "users";
const ME = "me";
const AUTHENTICATE = "authenticate"
const VENUES = "venues";
const BARS = "bars";
const ORDERS = "orders";
const ITEM = "item";
const CATEGORIES = "categories";
const DISCLAIMER = "disclaimer";
const BETA = "beta";
const PATRON_STATUS = "patronStatus";
const FORGOT_PASSWORD = "forgottenPassword";
const PASSWORD = "password";

export const PatronOrderStatus = {
  cancel: "patron_cancelled",
  submit: "patron_submitted",
};

export const BartenderOrderStatus = {
  making: "bartender_making",
  made: 'bartender_made',
  delivered: 'bartender_delivered'
}

const STRIPE_DOMAIN_BASE = "https://api.stripe.com/v1/";

function catchResponseErrors(response) {
  // console.log(response.status);
  if (response.status === 401) {
    throw ERRORS.AUTH_ERROR;
  } else if (response.status >= 400) {
    throw ERRORS.GENERAL;
  }
  return response;
}

function reauthAndMakeRequestAgain(fetchRequestData, onSuccess, onError, otherData) {
  return API(postAuthUser, null,
    (dispatch, getState, jsonResponse) => {
      dispatch(updateAuthToken(jsonResponse.accessToken));
      dispatch(API(fetchRequestData, null, onSuccess, onError, false, otherData))
    }, dispatch => dispatch(changeAuthErrorStatus(true)), false);
}

function dispatchError(dispatch, getState, onError) {
  if (typeof onError === "function") {
    onError(dispatch, getState);
  } else if (onError) {
    dispatch(onError);
  }
}

const API = (fetchRequestData, before, onSuccess, onError, reauthIfNeeded = true, otherData) => {
  return (dispatch, getState) => {
    if (!isConnected) {
      dispatch(changeNetworkErrorStatus(true));
      return;
    }
    if (typeof before === "function") {
      before(dispatch, getState);
    } else if (before) {
      dispatch(before);
    }

    createAPIFetchRequest(getState, fetchRequestData, otherData).then(catchResponseErrors)
    .then((response) => {
      return response.json();
    }).then((jsonResonse) => {
      // console.log(jsonResonse);
      onSuccess(dispatch, getState, jsonResonse)
    }).catch((err) => {
      // console.log(err);
      if (typeof err === "number") {
        switch (err) {
          case ERRORS.AUTH_ERROR:
            if (reauthIfNeeded) {
              dispatch(reauthAndMakeRequestAgain(fetchRequestData, onSuccess, onError, otherData));
            } else {
              dispatchError(dispatch, getState, onError);
            }
            break;
          case ERRORS.GENERAL:
            dispatchError(dispatch, getState, onError);
            break;
        }
      } else {
        dispatchError(dispatch, getState, onError);
      }
    });
  }
}

// Value can be primitive type or a list
function encodeGetKeyValuePair(key, value) {
  if (Array.isArray(value)) {
    let params = value.map(value => key + "=" + encodeURI(value));
    return params.length > 0 ? params.join("&") : "";
  } else {
    return key + "=" + encodeURI(value);
  }
}

function createAPIFetchRequest(getState, fetchRequestData, otherData) {
  return Promise.resolve(fetchRequestData(getState, otherData)).then(val => {
    const {method, data, path, noauth, domainBase, headers} = val;

    let init = {method, headers:{}};
    let url = domainBase || (getState().App.persistentSettings.useStaging ? STAGING_DOMAIN_BASE : DOMAIN_BASE);
    url += path.join('/');

    if (headers) {
      init.headers = val.headers;
    }
    else if (!noauth) {
      init.headers['Authorization'] = 'Bearer ' + getState().App.authToken;
    }

    if (method == "GET") {
      let params = [];
      if (data) {
        if (typeof data === "string") {
          url += "?" + data;
        } else {
          for (let key in data) {
            if (data[key]) {
              params.push(encodeGetKeyValuePair(key, data[key]));
            }
          }
          if (params.length > 0) {
            url += "?" + params.join("&");
          }
        }
      }
    } else {
      if (data) {
        if (typeof data === "string") {
          init.body = data;
        } else {
          init.headers['Content-Type'] = 'application/json';
          init.body = JSON.stringify(data);
        }
      }
    }
    // console.log(url);
    // console.log(data);

    return fetch(url, init);
  });
}


// Return fetch requests for BarBud API. All can accept getState.
export const getDisclaimer = () => {
  return {
    path: [DISCLAIMER]
  };
};

export const getVenues = () => {
  return Locations.getLocation().then(position => {
    let data = {};
    if (position) {
      data = {lat: position.coords.latitude, lng: position.coords.longitude, status: "onboarding"};
    }
    return {
      path: [VENUES],
      data,
      method: "GET",
    };
  });
}

export const getDrinks = (getState, barId) => {
  return {
    path: [BARS, barId, CATEGORIES],
    method: "GET",
  };
};

export const postCreateUser = (getState) => {
  return {
    path: [USERS],
    data: getState().SignUp.user,
    method: "POST",
    noauth: true
  };
};

export const postAuthUser = (getState) => {
  return {
    path: [USERS, AUTHENTICATE],
    data: getState().App.user,
    method: "POST",
    noauth: true
  }
};

export const getUser = () => {
  return {
    path: [USERS, ME],
    method: "GET",
  }
};

export const postUser = (getState, stripeSourceToken) => {
  let data = {};
  if (getState) {
    const newUserInfo = getState().App.settings.newUserInfo;
    ["name", "email", "phone", "password"].map((value) => {
      if(newUserInfo[value]) data[value] = newUserInfo[value];
    });
  }
  if (stripeSourceToken) data["stripeSourceToken"] = stripeSourceToken;
  return {
    path: [USERS, ME],
    data,
    method: "PUT",
  }
};

export const postCreateOrder = (getState) => {
  let data = [];
  const order = getState().Order.pendingOrder.order;
  let barId = "";
  for (let uuid in order) {
    // This is a hack
    barId = order[uuid].item.barId;
    data.push({drinkId: uuid, categoryId: order[uuid].item.categoryId, quantity: order[uuid].quantity});
  }
  data = {items: data};
  return {
    path: [BARS, barId, ORDERS],
    data,
    method: "POST",
  };
};

export const putUpdateOrder = (getState, drink) => {
  const orderData = getState().Order.pendingOrder.orderData;
  return {
    path: [BARS, orderData.bar.uuid, ORDERS, orderData.uuid, ITEM],
    data: drink,
    method: "PUT",
  };
};

export const postUpdateOrderStatus = (getState, {status, orderId, barId}) => {
  return {
    path: [BARS, barId, ORDERS, orderId, PATRON_STATUS],
    data: {status},
    method: "POST",
  }
}

export const putTipToOrder = (getState, {tipInCents, orderId, barId}) => {
  return {
    path: [BARS, barId, ORDERS, orderId],
    data: {tipInCents},
    method: "PUT",
  };
};

export const getOrdersByStatus = (getState, statuses) => {
  return {
    path: [USERS, ME, ORDERS],
    data: {status: statuses},
    method: "GET",
  }
}

export const postCheckBetaCode = (getState, code) => {
  return {
    path: [BETA],
    data: {code},
    method: "POST",
    noauth: true
  }
}

export const postForgotPassword = (getState) => {
  return {
    path: [USERS, FORGOT_PASSWORD],
    data: {email: getState().App.user.email},
    method: "POST",
    noauth: true
  }
}

export const putResetPassword = (getState, passwordResetCode) => {
  return {
    path: [USERS, PASSWORD],
    data: {email: getState().App.user.email, password: getState().App.user.password, passwordResetCode},
    method: "PUT",
    noauth: true
  }
}

// return fetch requests for Stripe API
export const postStripeTokenizeCard = (getState, payment) => {
  let stripeToken = 'pk_live_cLcYakQW0NlCkcFJdsNRq8eo';
  if (getState().App.persistentSettings.useStaging) {
    stripeToken = 'pk_test_xNhqBZ3MLnEqASVw7W66HuPo';
  }

  const stripeHeaders = new Headers({
    'Authorization': 'Bearer ' + stripeToken,
    'Content-Type': 'application/x-www-form-urlencoded'
  });
  let formStr = '';
  for (const key of Object.keys(payment)) {
    formStr += formStr ? "&" : '';
    formStr += "card[" + key + "]=" + payment[key];
  }
  return {
    domainBase: STRIPE_DOMAIN_BASE,
    path: ['tokens'],
    data: formStr,
    method: "POST",
    headers: stripeHeaders
  }
}

export default API;
