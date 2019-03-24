/**
 * Reducers pertaining to the sign up process
 */

import {
  SIGN_UP_NAME_CHANGED, 
  SIGN_UP_EMAIL_CHANGED, 
  SIGN_UP_PASSWORD_CHANGED, 
  SIGN_UP_PHONE_NUMBER_CHANGED, 
  SIGN_UP_DOB_CHANGED,
  API_SIGN_UP_DISCLAIMER_SUCCESS,
  API_SIGN_UP_DISCLAIMER_LOADING,
  API_SIGN_UP_DISCLAIMER_ERROR,
  API_SIGN_UP_CREATE_USER_SUCCESS,
  API_ADD_CARD_SUCCESS,
  API_ADD_CARD_LOADING,
  API_ADD_CARD_ERROR,
  API_SIGN_UP_CREATE_USER_LOADING,
  API_SIGN_UP_CREATE_USER_ERROR,
  API_AUTH_TOKEN_SUCCESS,
  SIGN_UP_RESET_PAYMENT_API_STATUS} from '../statics/types';

const initialState = {
  user: {
    name: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
  },
  apiStatus: {
    signUp: '',
    disclaimer: '',
    addCard: '',
  },
}

const SignUp = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_UP_NAME_CHANGED:
      return {
        ...state,
        user: {
          ...state.user,
          name: action.payload,
        }
      }
    case SIGN_UP_EMAIL_CHANGED:
      return {
        ...state,
        user: {
          ...state.user,
          email: action.payload,
        }
      }
    case SIGN_UP_PASSWORD_CHANGED:
      return {
        ...state,
        user: {
          ...state.user,
          password: action.payload,
        }
      }
    case SIGN_UP_PHONE_NUMBER_CHANGED:
      return {
        ...state,
        user: {
          ...state.user,
          phone: action.payload,
        }
      }
    case SIGN_UP_DOB_CHANGED:
      return {
        ...state,
        user: {
          ...state.user,
          dateOfBirth: action.payload,
        }
      }
    case API_SIGN_UP_DISCLAIMER_LOADING:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          disclaimer: 'loading',
        }     
      }
    case API_SIGN_UP_DISCLAIMER_SUCCESS:
      return {
        ...state,
        disclaimer: action.payload,
        apiStatus: {
          ...state.apiStatus,
          disclaimer: 'success'
        }
      }
    case API_SIGN_UP_DISCLAIMER_ERROR:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          disclaimer: 'error',
        }     
      }
    case API_SIGN_UP_CREATE_USER_LOADING:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          signUp: 'loading'
        }
      }
    case API_SIGN_UP_CREATE_USER_ERROR:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          signUp: 'error'
        }
      }
    case API_SIGN_UP_CREATE_USER_SUCCESS:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          signUp: 'success'
        }
      }
    case API_ADD_CARD_SUCCESS:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          addCard: 'success'
        }
      }
    case API_ADD_CARD_LOADING:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          addCard: 'loading'
        }
      }
    case API_ADD_CARD_ERROR:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          addCard: 'error'
        }
      }
    case SIGN_UP_RESET_PAYMENT_API_STATUS:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          addCard: initialState.apiStatus.addCard
        }
      }
    case API_AUTH_TOKEN_SUCCESS:
      return {...initialState}
    default:
      return state
  }
}

export default SignUp;




