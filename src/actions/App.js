import {
  API_NETWORK_ERROR, 
  API_AUTH_TOKEN_ERROR,
  API_AUTH_TOKEN_SUCCESS,
  API_CHECK_BETA_CODE_LOADING,
  API_CHECK_BETA_CODE_SUCCESS,
  API_CHECK_BETA_CODE_FAILURE,
  APP_OPEN_SETTINGS,
  APP_SET_USE_STAGING} from '../statics/types';
import API, {postCheckBetaCode} from '../helpers/API';

export const changeNetworkErrorStatus = (status) => {
  return {type: API_NETWORK_ERROR, payload: status};
}

export const changeAuthErrorStatus = (status) => {
  return {type: API_AUTH_TOKEN_ERROR, payload: status};
}

export const updateAuthToken = (authToken) => {
  return {type: API_AUTH_TOKEN_SUCCESS, payload: authToken};
}

export const openSettings = () => {
  return {type: APP_OPEN_SETTINGS, payload: true};
}

export const closeSettings = () => {
  return {type: APP_OPEN_SETTINGS, payload: false};
}

export const checkBetaCode = (code) => {
  return API(postCheckBetaCode, 
    {type: API_CHECK_BETA_CODE_LOADING},
    (dispatch, getState, jsonResponse) => {
      dispatch({type: API_CHECK_BETA_CODE_SUCCESS, payload: jsonResponse});
    }, 
    {type: API_CHECK_BETA_CODE_FAILURE},
    false,
    code);
};

export const setShouldUseStaging = (value) => {
  return {type: APP_SET_USE_STAGING, payload: value};
}
