/**
 * Actions pertaining to the sign up process
 */

import {
  SIGN_UP_NAME_CHANGED, 
  SIGN_UP_EMAIL_CHANGED, 
  SIGN_UP_PASSWORD_CHANGED, 
  SIGN_UP_PHONE_NUMBER_CHANGED, 
  SIGN_UP_DOB_CHANGED,
  API_SIGN_UP_DISCLAIMER_LOADING,
  API_SIGN_UP_DISCLAIMER_SUCCESS,
  API_SIGN_UP_DISCLAIMER_ERROR,
  API_SIGN_UP_CREATE_USER_LOADING,
  API_SIGN_UP_CREATE_USER_SUCCESS,
  API_SIGN_UP_CREATE_USER_ERROR,
  API_SETTINGS_CHANGE_USER_INFO_SUCCESS,
  API_ADD_CARD_SUCCESS,
  API_ADD_CARD_LOADING,
  API_ADD_CARD_ERROR,
  SIGN_UP_RESET_PAYMENT_API_STATUS} from '../statics/types';
import API, {
  getDisclaimer, 
  postStripeTokenizeCard, 
  postCreateUser,
  postUser} from '../helpers/API';
import {logInUser} from './User';

export const changeName = name => {
  return {
    type: SIGN_UP_NAME_CHANGED,
    payload: name
  }
}

export const changeEmail = email => {
  return {
    type: SIGN_UP_EMAIL_CHANGED,
    payload: email.replace(" ", "")
  }
}

export const changePassword = password => {
  return {
    type: SIGN_UP_PASSWORD_CHANGED,
    payload: password
  }
}

export const changePhone = phone => {
  return {
    type: SIGN_UP_PHONE_NUMBER_CHANGED,
    payload: phone
  }
}

export const changeDOB = dob => {
  return {
    type: SIGN_UP_DOB_CHANGED,
    payload: dob
  }
}

export const resetPaymentApiStatus = () => {
   return {type: SIGN_UP_RESET_PAYMENT_API_STATUS};
}

export const fetchDisclaimer = () => {
  return API(getDisclaimer, 
    {type: API_SIGN_UP_DISCLAIMER_LOADING}, 
    (dispatch, getState, jsonResponse) => {
      dispatch({type: API_SIGN_UP_DISCLAIMER_SUCCESS, payload: jsonResponse});
    },
    {type: API_SIGN_UP_DISCLAIMER_ERROR}
  )
};

export const addCardToUser = (card) => {
  const exp = card.values.expiry.split('/');
  const exp_month = exp.length > 0 ? exp[0] : '';
  const exp_year = exp.length > 1 ? exp[1] : '';
  
  const stripeData = {
    number: card.values.number.replace(/\D+/g, ''),
    cvc: card.values.cvc,
    exp_month,
    exp_year
  };

  return API(postStripeTokenizeCard,
    {type: API_ADD_CARD_LOADING},
    (dispatch, getState, jsonResponse) => {
      dispatch(API(postUser, 
        null,
        (dispatch, getState, jsonResponse) => {
          dispatch({type: API_SETTINGS_CHANGE_USER_INFO_SUCCESS, payload: jsonResponse});
          dispatch({type: API_ADD_CARD_SUCCESS});
        },
        {type: API_ADD_CARD_ERROR},
        true,
        jsonResponse.id
      ));
    },
    {type: API_ADD_CARD_ERROR},
    false,
    stripeData
  );
};

export const signUpUser = () => {
  return API(postCreateUser,
    {type: API_SIGN_UP_CREATE_USER_LOADING},
    (dispatch, getState, jsonResponse) => {
      dispatch(logInUser());
      dispatch({type: API_SIGN_UP_CREATE_USER_SUCCESS, payload: jsonResponse});
    },
    {type: API_SIGN_UP_CREATE_USER_ERROR}
  )
};


