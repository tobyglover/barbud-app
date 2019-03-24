import {
  API_VENUE_SEARCH_LOADING,
  API_VENUE_SEARCH_SUCCESS,
  API_VENUE_SEARCH_ERROR,
  VENUE_SELECTED_FROM_SEARCH,
  BAR_SELECTED_FROM_VENUE,
  API_BAR_DRINKS_LOADING,
  API_BAR_DRINKS_SUCCESS,
  API_BAR_DRINKS_ERROR,
  VENUE_SEARCH_STATUS,
  USER_LOG_OUT} from '../statics/types';

const initialState = {
  apiStatus: {
    search: '',
    drinks: ''
  },
  venueSearchList: [],
  searchOpen: true,
  selectedVenue: {},
  selectedBar: -1,
  menu: []
}

const Bar = (state = initialState, action) => {
  switch (action.type) {
    case API_VENUE_SEARCH_LOADING:
      return {...state, apiStatus: {...state.apiStatus, search: 'loading'}};
    case API_VENUE_SEARCH_ERROR:
      return {...state, apiStatus: {...state.apiStatus, search: 'error'}};
    case API_VENUE_SEARCH_SUCCESS:
      return {
        ...state,
        apiStatus: {...state.apiStatus, search: 'success'},
        venueSearchList: action.payload
      };
    case VENUE_SELECTED_FROM_SEARCH:
      return {...state, selectedVenue: action.payload};
    case BAR_SELECTED_FROM_VENUE:
      return {...state, selectedBar: action.payload};
    case API_BAR_DRINKS_LOADING:
      return {...state, apiStatus: {...state.apiStatus, drinks: 'loading'}};
    case API_BAR_DRINKS_ERROR:
      return {...state, apiStatus: {...state.apiStatus, drinks: 'error'}};
    case API_BAR_DRINKS_SUCCESS:
      return {
        ...state,
        apiStatus: {...state.apiStatus, drinks: 'success'},
        menu: action.payload
      };
    case VENUE_SEARCH_STATUS:
      const searchOpen = action.payload;
      const selectedVenue = searchOpen ? initialState.selectedVenue : state.selectedVenue;
      const selectedBar = searchOpen ? initialState.selectedBar : state.selectedBar;
      return {
        ...state,
        searchOpen,
        selectedVenue,
        selectedBar,
        menu: initialState.menu
      }
    case USER_LOG_OUT:
      return {...initialState};
    default:
      return state
  }
}

export default Bar;
