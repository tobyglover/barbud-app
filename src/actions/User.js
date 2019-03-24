import {
  API_LOG_IN_USER_FAILURE,
  LOG_IN_PASSWORD_CHANGED,
  LOG_IN_EMAIL_CHANGED,
  API_LOG_IN_USER_LOADING,
  USER_LOG_OUT,
  API_GET_USER_INFO_LOADING,
  API_GET_USER_INFO_SUCCESS,
  API_GET_USER_INFO_ERROR,
  API_GET_USER_ORDER_STATUSES_LOADING,
  API_GET_USER_ORDER_STATUSES_ERROR,
  API_GET_USER_ORDER_STATUSES_SUCCESS,
  API_POST_VALIDATION_CODE_SUCCESS,
  API_POST_VALIDATION_CODE_LOADING,
  API_POST_VALIDATION_CODE_ERROR,
  API_PUT_RESET_PASSWORD_ERROR,
  API_PUT_RESET_PASSWORD_LOADING} from '../statics/types';
import API, {
  postAuthUser, 
  getUser, 
  getOrdersByStatus, 
  postForgotPassword,
  putResetPassword,
  BartenderOrderStatus, 
  PatronOrderStatus} from '../helpers/API';
import {updateAuthToken} from './App';

export const logInPasswordChanged = (password) => {
  return {
    type: LOG_IN_PASSWORD_CHANGED,
    payload: password
  }
}

export const logInEmailChanged = (email) => {
  return {
    type: LOG_IN_EMAIL_CHANGED,
    payload: email.replace(" ", "")
  }
}

export const logInUser = () => {
  return API(postAuthUser, {type: API_LOG_IN_USER_LOADING},
    (dispatch, getState, jsonResponse) => {
      dispatch(updateAuthToken(jsonResponse.accessToken));
    },
    {type: API_LOG_IN_USER_FAILURE}, false);
}

export const logoutUser = () => {
  return {type: USER_LOG_OUT};
}

export const getUserInfo = () => {
  return API(getUser, {type: API_GET_USER_INFO_LOADING},
    (dispatch, getState, jsonResponse) => {
      dispatch({type: API_GET_USER_INFO_SUCCESS, payload: jsonResponse});
    },
    {type: API_GET_USER_INFO_ERROR});
}

export const getUserOrderStatuses = (statuses = [PatronOrderStatus.submit, BartenderOrderStatus.making, BartenderOrderStatus.made, BartenderOrderStatus.delivered]) => {
  return API(getOrdersByStatus, {type: API_GET_USER_ORDER_STATUSES_LOADING},
    (dispatch, getState, jsonResponse) => {
      dispatch({
        type: API_GET_USER_ORDER_STATUSES_SUCCESS, 
        payload: {
          response: jsonResponse,
          statuses
        }
      });
    },
    {type: API_GET_USER_ORDER_STATUSES_ERROR}, 
    true,
    statuses);
};

export const getValidationCode = () => {
  return API(postForgotPassword, {type: API_POST_VALIDATION_CODE_LOADING},
    (dispatch, getState, jsonResponse) => {
      dispatch({type: API_POST_VALIDATION_CODE_SUCCESS, payload: jsonResponse})
    },
    {type: API_POST_VALIDATION_CODE_ERROR}, 
    false);
};

export const resetPassword = (validationCode) => {
  return API(putResetPassword, {type: API_PUT_RESET_PASSWORD_LOADING},
    (dispatch, getState, jsonResponse) => {
      dispatch(updateAuthToken(jsonResponse.accessToken))
    },
    {type: API_PUT_RESET_PASSWORD_ERROR}, 
    false,
    validationCode);
}
