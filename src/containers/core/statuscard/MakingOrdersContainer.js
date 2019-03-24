import { connect } from 'react-redux';

import MakingOrders from '../../../components/core/statuscard/orderstatus/MakingOrders';

const mapStateToProps = state => {
  return { 
    makingOrders: state.Order.makingOrders
  }

}

const mapDispatchToProps = dispatch => {
  return {};
}

const MakingOrdersContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MakingOrders);

export default MakingOrdersContainer;
