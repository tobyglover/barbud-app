import {
  SIGN_UP_PASSWORD_CHANGED, 
  SIGN_UP_EMAIL_CHANGED,
  API_AUTH_TOKEN_SUCCESS,
  API_NETWORK_ERROR,
  API_AUTH_TOKEN_ERROR,
  LOG_IN_PASSWORD_CHANGED,
  LOG_IN_EMAIL_CHANGED,
  API_LOG_IN_USER_FAILURE,
  API_LOG_IN_USER_LOADING,
  API_GET_USER_INFO_LOADING,
  API_GET_USER_INFO_SUCCESS,
  API_GET_USER_INFO_ERROR,
  APP_OPEN_SETTINGS,
  USER_LOG_OUT,
  SETTINGS_CHANGE_USER_INFO,
  SETTINGS_RESET_USER_INFO,
  API_SETTINGS_CHANGE_USER_INFO_LOADING,
  API_SETTINGS_CHANGE_USER_INFO_SUCCESS,
  API_SETTINGS_CHANGE_USER_INFO_ERROR,
  RESET_API_STATUS_NEW_USER_INFO,
  API_CHECK_BETA_CODE_LOADING,
  API_CHECK_BETA_CODE_SUCCESS,
  API_CHECK_BETA_CODE_FAILURE,
  API_POST_VALIDATION_CODE_SUCCESS,
  API_POST_VALIDATION_CODE_LOADING,
  API_POST_VALIDATION_CODE_ERROR,
  API_PUT_RESET_PASSWORD_ERROR,
  API_PUT_RESET_PASSWORD_LOADING,
  APP_SET_USE_STAGING} from '../statics/types';
import {
  reasonInvalidName, 
  reasonInvalidEmail, 
  reasonInvalidPassword,
  reasonInvalidPhone} from '../helpers/Validation';

const initialState = {
    user: {
      email: '',
      password: '',
      isBetaUser: false,
    },
    persistentSettings: {
      useStaging: false
    },
    settings: {
      userInfo: null,
      openSettings: false,
      newUserInfo: {
        name: null,
        email: null,
        currentPassword: null,
        password: null,
        passwordConfirm: null,
        phone: null,
        creditCard: null
      },
      newUserInfoValidation: {
        name: "",
        email: "",
        currentPassword: "",
        password: "",
        passwordConfirm: "",
        phone: "",
        creditCard: false
      }
    },
    authToken: '',
    apiStatus: {
      network: '',
      auth: '',
      login: '',
      userInfo: '',
      newUserInfo: '',
      betaCode: '',
      validationCode: '',
      resetPassword: ''
    }
};

const App = (state = initialState, action) => {
  switch (action.type) {
    case API_CHECK_BETA_CODE_LOADING:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          betaCode: 'loading'
        }
      }
    case API_CHECK_BETA_CODE_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          isBetaUser: action.payload.valid
        },
        apiStatus: {
          ...state.apiStatus,
          betaCode: 'success'
        }
      }
    case API_CHECK_BETA_CODE_FAILURE:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          betaCode: 'error'
        }
      }
    case SIGN_UP_PASSWORD_CHANGED:
    case LOG_IN_PASSWORD_CHANGED:
      return {
        ...state, 
        user: {...state.user, password: action.payload}
      };
    case SIGN_UP_EMAIL_CHANGED:
    case LOG_IN_EMAIL_CHANGED:
      return {
        ...state, 
        user: {...state.user, email: action.payload}
      };
    case API_AUTH_TOKEN_SUCCESS:
      return {...state, 
        authToken: action.payload,
        apiStatus: {
          ...state.apiStatus,
          auth: '',
          login: ''
        }
      }
    case API_NETWORK_ERROR:
      return {...state, 
        apiStatus: {
          ...state.apiStatus, 
          network: action.payload,
          login: state.apiStatus.login == 'loading' ? '' : state.apiStatus.login
        }};
    case API_LOG_IN_USER_FAILURE:
      return {
        ...initialState, 
        user: {email: state.user.email, password: '', isBetaUser: state.user.isBetaUser},
        apiStatus: {
          ...state.apiStatus,
          login: 'error'
        }
      };
    case API_LOG_IN_USER_LOADING:
      return {...state, 
        apiStatus: {
          ...state.apiStatus,
          login: 'loading'
        }};
    case API_AUTH_TOKEN_ERROR:
      return {
        ...initialState, 
        user: {email: state.user.email, password: '', isBetaUser: state.user.isBetaUser},
        apiStatus: {...state.apiStatus, auth: action.payload}
      };
    case APP_OPEN_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          openSettings: action.payload
        },
      }
    case USER_LOG_OUT:
      return {
        ...initialState,
        user: {...initialState.user, email: state.user.email, isBetaUser: state.user.isBetaUser},
        persistentSettings: {
          ...state.persistentSettings
        }
      }
    case API_GET_USER_INFO_LOADING:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          userInfo: 'loading'
        }
      }
    case API_GET_USER_INFO_SUCCESS:
      return {
        ...state,
        settings: {
          ...state.settings,
          userInfo: action.payload,
        },
        apiStatus: {
          ...state.apiStatus,
          userInfo: ''
        }
      }
    case API_GET_USER_INFO_ERROR:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          userInfo: 'error'
        }
      }
    case SETTINGS_CHANGE_USER_INFO:
      state = {
        ...state,
        settings: {
          ...state.settings,
          newUserInfo: {
            ...state.settings.newUserInfo,
          },
          newUserInfoValidation: {
            ...state.settings.newUserInfoValidation
          }
        }
      };
      const key = action.payload.key;
      let creditCardInfo = null;
      if (key === "creditCard") {
        creditCardInfo = action.payload.value;
      } else {
        let value = action.payload.value !== state.settings.userInfo[key]
                    ? action.payload.value : null;
        state.settings.newUserInfo[key] = value;
      }
      return validatateNewUserSettings(state, key, creditCardInfo);
    case SETTINGS_RESET_USER_INFO:
      return {
        ...state,
        settings: {
          ...state.settings,
          newUserInfo: {
            ...initialState.settings.newUserInfo,
          },
          newUserInfoValidation: {
            ...initialState.settings.newUserInfoValidation
          }
        }
      }
    case API_SETTINGS_CHANGE_USER_INFO_LOADING:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          newUserInfo: 'loading'
        }
      }
    case API_SETTINGS_CHANGE_USER_INFO_SUCCESS:
      return {
        ...state,
        settings: {
          ...state.settings,
          userInfo: action.payload,
          newUserInfo: {...initialState.settings.newUserInfo},
          newUserInfoValidation: {...initialState.settings.newUserInfoValidation}
        },
        apiStatus: {
          ...state.apiStatus,
          newUserInfo: 'success'
        }
      }
    case API_SETTINGS_CHANGE_USER_INFO_ERROR: 
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          newUserInfo: 'error'
        }
      }
    case RESET_API_STATUS_NEW_USER_INFO:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          newUserInfo: initialState.apiStatus.newUserInfo
        }
      }
    case API_POST_VALIDATION_CODE_SUCCESS:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          validationCode: action.payload
        }
      }
    case API_POST_VALIDATION_CODE_LOADING:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          validationCode: 'loading'
        }
      }
    case API_POST_VALIDATION_CODE_ERROR:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          validationCode: 'error'
        }
      }
    case API_PUT_RESET_PASSWORD_ERROR:
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          resetPassword: 'error'
        }
      }
    case API_PUT_RESET_PASSWORD_LOADING:
       return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          resetPassword: 'loading'
        }
      }
    case APP_SET_USE_STAGING: 
      return {
        ...state,
        persistentSettings: {
          ...state.persistentSettings,
          useStaging: action.payload
        }
      }
    default:
      return state;
  }
}

function validatateNewUserSettings(state, key, creditCardInfo) {
  const keysToFunctions = {
    name: reasonInvalidName,
    email: reasonInvalidEmail,
    password: reasonInvalidPassword,
    passwordConfirm: reasonInvalidPassword,
    phone: reasonInvalidPhone,
  };
  if (key == "creditCard") {
    if (creditCardInfo) {
      state.settings.newUserInfoValidation.creditCard = !creditCardInfo.valid;
      const exp = creditCardInfo.values.expiry.split('/');
      state.settings.newUserInfo.creditCard = {
        number: creditCardInfo.values.number.replace( /\D+/g, ''),
        cvc: creditCardInfo.values.cvc,
        exp_month: exp.length > 0 ? exp[0] : '',
        exp_year: exp.length > 1 ? exp[1] : '',
      }
    } else {
      state.settings.newUserInfo.creditCard = null;
      state.settings.newUserInfoValidation.creditCard = false;
    }
    
  } else if (state.settings.newUserInfo[key] !== null) {
    if (key !== "currentPassword") {
      state.settings.newUserInfoValidation[key] = keysToFunctions[key](state.settings.newUserInfo[key]);
    }
    if (key == "passwordConfirm" || key == "password") {
      state.settings.newUserInfoValidation["passwordConfirm"] = 
        state.settings.newUserInfo.passwordConfirm !== state.settings.newUserInfo.password ?
          "New password does not match" : state.settings.newUserInfoValidation.passwordConfirm
    } 
  } else {
    state.settings.newUserInfoValidation[key] = '';
  }
  return state;
}

export default App;
