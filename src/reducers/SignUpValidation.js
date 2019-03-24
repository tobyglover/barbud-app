/**
 * Reducers pertaining to the validating sign up fields
 */
 /*eslint no-useless-escape: 0 */
import {
  SIGN_UP_NAME_CHANGED, 
  SIGN_UP_EMAIL_CHANGED, 
  SIGN_UP_PASSWORD_CHANGED, 
  SIGN_UP_PHONE_NUMBER_CHANGED, 
  SIGN_UP_DOB_CHANGED,
  API_SIGN_UP_CREATE_USER_SUCCESS} from '../statics/types';
import {
  reasonInvalidName, 
  reasonInvalidEmail, 
  reasonInvalidPassword,
  reasonInvalidPhone,
  reasonInvalidDOB} from '../helpers/Validation';

const initialState = {
  user: {
    name: true,
    email: true,
    password: true,
    phone: false,
    dateOfBirth: true
  },
  payment: true,
};

const SignUpValidation = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_UP_NAME_CHANGED:
      return {
        ...state,
        user: {
          ...state.user,
          name: reasonInvalidName(action.payload),
        }
      };
    case SIGN_UP_EMAIL_CHANGED:
      return {
        ...state,
        user: {
          ...state.user,
          email: reasonInvalidEmail(action.payload),
        }
      };
    case SIGN_UP_PASSWORD_CHANGED:
      return {
        ...state,
        user: {
          ...state.user,
          password: reasonInvalidPassword(action.payload),
        }
      };
    case SIGN_UP_PHONE_NUMBER_CHANGED:
      return {
        ...state,
        user: {
          ...state.user,
          phone: reasonInvalidPhone(action.payload),
        }
      };
    case SIGN_UP_DOB_CHANGED:
      return {
        ...state,
        user: {
          ...state.user,
          dateOfBirth: reasonInvalidDOB(action.payload),
        }
      }
    case API_SIGN_UP_CREATE_USER_SUCCESS:
      return initialState
    default:
      return state;
  }
}

export default SignUpValidation;




