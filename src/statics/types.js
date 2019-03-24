// Action Types

/************************************************
 *
 * GENERAL
 *
 ************************************************/

export const API_NETWORK_ERROR = "API_NETWORK_ERROR";
export const API_AUTH_TOKEN_ERROR = "API_AUTH_TOKEN_ERROR";
export const API_AUTH_TOKEN_SUCCESS = "API_AUTH_TOKEN_SUCCESS";
export const APP_OPEN_SETTINGS = "APP_OPEN_SETTINGS";

/************************************************
 *
 * SIGN UP
 *
 ************************************************/
 
// Personal Info Section
export const SIGN_UP_NAME_CHANGED = "SIGN_UP_NAME_CHANGED";
export const SIGN_UP_EMAIL_CHANGED = "SIGN_UP_EMAIL_CHANGED";
export const SIGN_UP_PASSWORD_CHANGED = "SIGN_UP_PASSWORD_CHANGED";
export const SIGN_UP_PHONE_NUMBER_CHANGED = "SIGN_UP_PHONE_NUMBER_CHANGED";
export const SIGN_UP_DOB_CHANGED = "SIGN_UP_DOB_CHANGED";
// API Types
export const API_SIGN_UP_DISCLAIMER_LOADING = "API_SIGN_UP_DISCLAIMER_LOADING";
export const API_SIGN_UP_DISCLAIMER_SUCCESS = "API_SIGN_UP_DISCLAIMER_SUCCESS";
export const API_SIGN_UP_DISCLAIMER_ERROR = "API_SIGN_UP_DISCLAIMER_ERROR";
export const API_SIGN_UP_CREATE_USER_LOADING = "API_SIGN_UP_CREATE_USER_LOADING";
export const API_SIGN_UP_CREATE_USER_SUCCESS = "API_SIGN_UP_CREATE_USER_SUCCESS";
export const API_SIGN_UP_CREATE_USER_ERROR = "API_SIGN_UP_CREATE_USER_ERROR";
export const API_ADD_CARD_SUCCESS = "API_ADD_CARD_SUCCESS";
export const API_ADD_CARD_LOADING = "API_ADD_CARD_LOADING";
export const API_ADD_CARD_ERROR = "API_ADD_CARD_ERROR";
export const SIGN_UP_RESET_PAYMENT_API_STATUS = "SIGN_UP_RESET_PAYMENT_API_STATUS";

/************************************************
 *
 * BAR 
 *
 ************************************************/

export const VENUE_SELECTED_FROM_SEARCH = "VENUE_SELECTED_FROM_SEARCH";
export const BAR_SELECTED_FROM_VENUE = "BAR_SELECTED_FROM_VENUE";
export const API_BAR_DRINKS_LOADING = "API_BAR_DRINKS_LOADING";
export const API_BAR_DRINKS_SUCCESS = "API_BAR_DRINKS_SUCCESS";
export const API_BAR_DRINKS_ERROR = "API_BAR_DRINKS_ERROR";
export const VENUE_SEARCH_STATUS = "VENUE_SEARCH_STATUS";
export const API_VENUE_SEARCH_LOADING = "API_VENUE_SEARCH_LOADING";
export const API_VENUE_SEARCH_SUCCESS = "API_VENUE_SEARCH_SUCCESS";
export const API_VENUE_SEARCH_ERROR = "API_VENUE_SEARCH_ERROR";


/************************************************
 *
 * ORDER 
 *
 ************************************************/

export const ORDER_DRINK_ITEM_SELECTED = "ORDER_DRINK_ITEM_SELECTED";
export const ORDER_CHANGE_QUANTITY_SELECTED_ITEM = "ORDER_CHANGE_QUANTITY_SELECTED_ITEM";
export const ORDER_ADD_SELECTED_ITEM_TO_ORDER = "ORDER_ADD_SELECTED_ITEM_TO_ORDER";
export const API_CREATE_ORDER_LOADING = "API_CREATE_ORDER_LOADING";
export const API_CREATE_ORDER_ERROR = "API_CREATE_ORDER_ERROR";
export const API_CREATE_ORDER_SUCCESS = "API_CREATE_ORDER_SUCCESS";
export const API_UPDATE_ORDER_LOADING = "API_UPDATE_ORDER_LOADING";
export const API_UPDATE_ORDER_SUCCESS = "API_UPDATE_ORDER_SUCCESS";
export const API_UPDATE_ORDER_ERROR = "API_UPDATE_ORDER_ERROR";
export const API_PLACE_ORDER_LOADING = "API_PLACE_ORDER_LOADING";
export const API_PLACE_ORDER_SUCCESS = "API_PLACE_ORDER_SUCCESS";
export const API_PLACE_ORDER_ERROR = "API_PLACE_ORDER_ERROR";
export const API_GET_USER_ORDER_STATUSES_LOADING = "API_GET_USER_ORDER_STATUSES_LOADING";
export const API_GET_USER_ORDER_STATUSES_ERROR = "API_GET_USER_ORDER_STATUSES_ERROR";
export const API_GET_USER_ORDER_STATUSES_SUCCESS = "API_GET_USER_ORDER_STATUSES_SUCCESS";
export const API_PUT_TIP_ORDER_LOADING = "API_PUT_TIP_ORDER_LOADING";
export const API_PUT_TIP_ORDER_SUCCESS = "API_PUT_TIP_ORDER_SUCCESS";
export const API_PUT_TIP_ORDER_ERROR = "API_PUT_TIP_ORDER_ERROR";
export const API_PUT_TIP_ORDER_CLEAR = "API_PUT_TIP_ORDER_CLEAR";
export const CHANGE_STATUS_OF_ORDER = "CHANGE_STATUS_OF_ORDER";
export const SHOW_ORDER_CODE_MODAL = "SHOW_ORDER_CODE_MODAL";


/************************************************
 *
 * USER 
 *
 ************************************************/

export const API_LOG_IN_USER_FAILURE = "API_LOG_IN_USER_FAILURE";
export const API_LOG_IN_USER_LOADING = "API_LOG_IN_USER_LOADING";
export const LOG_IN_PASSWORD_CHANGED = "LOG_IN_PASSWORD_CHANGED";
export const LOG_IN_EMAIL_CHANGED = "LOG_IN_EMAIL_CHANGED";
export const USER_LOG_OUT = "USER_LOG_OUT";
export const API_GET_USER_INFO_LOADING = "API_GET_USER_INFO_LOADING";
export const API_GET_USER_INFO_SUCCESS = "API_GET_USER_INFO_SUCCESS";
export const API_GET_USER_INFO_ERROR = "API_GET_USER_INFO_ERROR";
export const SETTINGS_CHANGE_USER_INFO = "SETTINGS_CHANGE_USER_INFO";
export const SETTINGS_RESET_USER_INFO = "SETTINGS_RESET_USER_INFO";
export const API_SETTINGS_CHANGE_USER_INFO_LOADING = "API_SETTINGS_CHANGE_USER_INFO_LOADING";
export const API_SETTINGS_CHANGE_USER_INFO_SUCCESS = "API_SETTINGS_CHANGE_USER_INFO_SUCCESS";
export const API_SETTINGS_CHANGE_USER_INFO_ERROR = "API_SETTINGS_CHANGE_USER_INFO_ERROR";
export const RESET_API_STATUS_NEW_USER_INFO = "RESET_API_STATUS_NEW_USER_INFO";
export const API_POST_VALIDATION_CODE_SUCCESS = "API_POST_VALIDATION_CODE_SUCCESS";
export const API_POST_VALIDATION_CODE_LOADING = "API_POST_VALIDATION_CODE_LOADING";
export const API_POST_VALIDATION_CODE_ERROR = "API_POST_VALIDATION_CODE_ERROR";
export const API_PUT_RESET_PASSWORD_ERROR = "API_PUT_RESET_PASSWORD_ERROR";
export const API_PUT_RESET_PASSWORD_LOADING = "API_PUT_RESET_PASSWORD_LOADING";

/************************************************
 *
 * APP 
 *
 ************************************************/
export const API_CHECK_BETA_CODE_LOADING = "API_CHECK_BETA_CODE_LOADING";
export const API_CHECK_BETA_CODE_SUCCESS = "API_CHECK_BETA_CODE_SUCCESS";
export const API_CHECK_BETA_CODE_FAILURE = "API_CHECK_BETA_CODE_FAILURE";
export const APP_SET_USE_STAGING = "APP_SET_USE_STAGING";