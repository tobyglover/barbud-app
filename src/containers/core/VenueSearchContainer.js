import { connect } from 'react-redux';
import { venueSelected, searchVenues } from '../../actions/Bar';

import VenueSearch from '../../components/core/VenueSearch';

const mapStateToProps = state => {
  return {
    searchApiStatus: state.Bar.apiStatus.search,
    barList: state.Bar.venueSearchList
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onListRefresh: () => dispatch(searchVenues()),
    onListItemSelected: item => dispatch(venueSelected(item)),
  }
}

const VenueSearchContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(VenueSearch);

export default VenueSearchContainer;
