import {
  SETTINGS_CHANGE_USER_INFO,
  SETTINGS_RESET_USER_INFO,
  API_SETTINGS_CHANGE_USER_INFO_LOADING,
  API_SETTINGS_CHANGE_USER_INFO_SUCCESS,
  API_SETTINGS_CHANGE_USER_INFO_ERROR,
  RESET_API_STATUS_NEW_USER_INFO} from '../statics/types';
import API, {postStripeTokenizeCard, postUser} from '../helpers/API';

export const changeUserInfo = (key, value) => {
  return {type: SETTINGS_CHANGE_USER_INFO, payload: {key, value}};
}

export const resetNewUserInfo = () => {
  return {type: SETTINGS_RESET_USER_INFO};
}

export const sendUserInfoChanges = () => {
  const postUserAPI = (stripeSourceToken) => {
    return API(postUser, {type: API_SETTINGS_CHANGE_USER_INFO_LOADING},
      (dispatch, getState, jsonResponse) => {
        dispatch({type: API_SETTINGS_CHANGE_USER_INFO_SUCCESS, payload: jsonResponse});
      },
      {type: API_SETTINGS_CHANGE_USER_INFO_ERROR},
      true, stripeSourceToken);
  }
  return (dispatch, getState) => {
    if (getState().App.settings.newUserInfo.creditCard != null) {
      dispatch(API(postStripeTokenizeCard, null,
        (dispatch, getState, jsonResponse) => {
          dispatch(postUserAPI(jsonResponse.id));
        },
        {type: API_SETTINGS_CHANGE_USER_INFO_ERROR},
        false, getState().App.settings.newUserInfo.creditCard));
    } else {
      dispatch(postUserAPI());
    }
  }
};

export const resetApiNewUserInfo = () => {
  return {type: RESET_API_STATUS_NEW_USER_INFO};
};
