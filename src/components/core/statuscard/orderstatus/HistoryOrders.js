import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import DrinkItem from '../../Venue/DrinkItem'
import {Styles as PendingOrderStyles} from './PendingOrder'
import StatusCardBase from '../StatusCardBase'
import T from '../../../widgets/T';
import Button from '../../../widgets/Button';
import TipsContainer from '../../../../containers/core/statuscard/TipsContainer'
import {formatPriceInCents} from '../../../../helpers/Helpers'
import {orange} from '../../../../statics/colors'
import moment from 'moment';

const ORDER_PRICE_MIN_FOR_PERCENTAGES = 667;

const Styles = StyleSheet.create({
  seperator: {
    borderBottomWidth: StyleSheet.hairlineWidth, 
    borderColor: 'black',
    width: '90%'
  },
  center: {
    alignItems: 'center',
  },
  total: {
    marginTop: 10,
    marginRight: 15,
    color: orange,
    textAlign: 'right'
  },
  badgeStyle: {
    backgroundColor: 'transparent',
    marginRight: 10
  },
  badgeNumberStyle: {
    fontSize: 20,
    color: 'black'
  },
  showMoreButton: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white'
  }
});

export default class HistoryOrders extends Component {
  componentWillMount() {
    this.setState({itemLimit: 3});
  }

  getOrderItems(items) {
    return items.map(value =>
      <DrinkItem
        key={value.drink.uuid}
        showTotal={true}
        quantity={value.quantity}
        item={value.drink}
        badgeProps={{style: Styles.badgeStyle, numberStyle: Styles.badgeNumberStyle}}/>);
  }

  renderHistoryOrder(order) {
    const {createdAt, uuid, tipInCents, fees, totalPriceInCents, totalPriceInCentsWithFees, items, bartender} = order;
    const bartenderName = bartender.nickname || bartender.name;
    
    let tips = null;
    if (tipInCents == null) {
      tips = <TipsContainer prompt={`Add a tip for ${bartenderName}`} order={order}/>;
    } else if (tipInCents > 0) {
      let percentage = "Tip " + (totalPriceInCents > ORDER_PRICE_MIN_FOR_PERCENTAGES ? `(${(tipInCents / totalPriceInCents * 100).toFixed()}%)` : "");
      tips = <View style={PendingOrderStyles.billingItem}>
          <T type="h4" style={PendingOrderStyles.billingItemTitle}>{percentage}</T>
          <T type="h4">{formatPriceInCents(tipInCents)}</T>
        </View>;
    }
        
    return (
      <StatusCardBase key={uuid}>
        <View style={Styles.center}>
          <T type="h1">{order.bar.venue.name}</T>
          <T type="h4">{moment(createdAt).format("dddd, MMMM Do h:mm A")}</T>
          <View style={Styles.seperator}/>
        </View>
        <View>
          {this.getOrderItems(items)}
        </View>
        <View style={Styles.center}><View style={Styles.seperator}/></View>
        {tips}
        <View style={PendingOrderStyles.billingItem}>
          <T type="h4" style={PendingOrderStyles.billingItemTitle}>Tax and Convenience Fee</T>
          <T type="h4">{formatPriceInCents(fees)}</T>
        </View>
        <T type="h2" style={PendingOrderStyles.totalPrice}>Total: {formatPriceInCents(totalPriceInCentsWithFees + tipInCents)}</T>
      </StatusCardBase>
    );
  }

  renderHistoryOrders() {
    const limit = this.state.itemLimit > this.props.history.length ? this.props.history.length : this.state.itemLimit;
    const orders = [];
    for (let i = 0; i < limit; i++) {
      orders.push(this.renderHistoryOrder(this.props.history[i]));
    }
    return orders;
  }

  showMore() {
    this.setState({itemLimit: this.state.itemLimit + 5});
  }

  render() {
    const orders = this.renderHistoryOrders();
    const seeMoreButton = orders.length != this.props.history.length ? 
      <Button 
        onPress={this.showMore.bind(this)}
        type="text"
        text="Show More History"
        textProps={{style: Styles.showMoreButton}}/> : null;
    return (
      <View>
        {orders}
        {seeMoreButton}
      </View>
    );
  }
}
