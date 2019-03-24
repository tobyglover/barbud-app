import { connect } from 'react-redux';
import { drinkItemPressed } from '../../actions/Order';
import { getDrinksForBar, barSelected } from '../../actions/Bar'

import Venue from '../../components/core/Venue';

const mapStateToProps = state => {
  const venue = state.Bar.selectedVenue;
  return {
    venue,
    bar: state.Bar.selectedBar != -1 && venue.bars[state.Bar.selectedBar],
    barIndex: state.Bar.selectedBar,
    menu: state.Bar.menu,
    show: !state.Bar.searchOpen,
    order: state.Order.pendingOrder.order,
    apiStatus: state.Bar.apiStatus.drinks
  };
}

const mapDispatchToProps = dispatch => {
  return {
    barSelected: (index) => dispatch(barSelected(index)),
    getDrinksForBar: (barId) => dispatch(getDrinksForBar(barId)),
    onDrinkItemPressed: (item) => dispatch(drinkItemPressed(item)),
  }
}

const VenueContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Venue);

export default VenueContainer;
