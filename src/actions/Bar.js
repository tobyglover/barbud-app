import {
  VENUE_SELECTED_FROM_SEARCH,
  BAR_SELECTED_FROM_VENUE,
  VENUE_SEARCH_STATUS,
  API_VENUE_SEARCH_LOADING,
  API_VENUE_SEARCH_SUCCESS,
  API_VENUE_SEARCH_ERROR,
  API_BAR_DRINKS_LOADING,
  API_BAR_DRINKS_SUCCESS,
  API_BAR_DRINKS_ERROR} from '../statics/types';
import API, {getVenues, getDrinks} from '../helpers/API';

export const searchVenues = () => {
  return API(getVenues,
    {type: API_VENUE_SEARCH_LOADING},
    (dispatch, getState, jsonResponse) => {
      dispatch({type: API_VENUE_SEARCH_SUCCESS, payload: jsonResponse});
    },
    {type: API_VENUE_SEARCH_ERROR});
}

export const venueSelected = (venue) => {
  return {type: VENUE_SELECTED_FROM_SEARCH, payload: venue};
}

export const barSelected = (index) => {
  return (dispatch, getState) => {
    const barStore = getState().Bar;
    const prevIndex = barStore.selectedBar;
    dispatch({type: BAR_SELECTED_FROM_VENUE, payload: index});

    if (index != -1 && prevIndex != index) {
      const barId = barStore.selectedVenue.bars[index].uuid;
      dispatch(getDrinksForBar(barId));
    }
  }
}

export const getDrinksForBar = (barId) => {
  return API(getDrinks,
    {type: API_BAR_DRINKS_LOADING},
    (dispatch, getState, jsonResponse) => {
      dispatch({type: API_BAR_DRINKS_SUCCESS, payload: jsonResponse});
    },
    {type: API_BAR_DRINKS_ERROR},
    true,
    barId);
};

export const changeSearchStatus = (status) => {
  return {type: VENUE_SEARCH_STATUS, payload: status};
};
