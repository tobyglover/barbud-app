import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import StatusCardBase from '../StatusCardBase';

import T from '../../../widgets/T';
import {orange} from '../../../../statics/colors';

const Styles = StyleSheet.create({
  headerText: {
    textAlign: 'center',
    color: orange,
  },
  standardText: {
    marginVertical: 10,
    textAlign: 'center'
  },
  orderStatus: {
    marginVertical: 15,
    alignItems: 'center'
  },
  cancelContainer: {
    alignItems: 'center'
  },
});

export default class MakingOrders extends Component {
  renderMakingOrder({uuid}) {
    return (
      <StatusCardBase key={uuid}>
        <T type="h1" style={Styles.headerText}>Order In Progress</T>
        <T style={Styles.standardText}>You'll get a notification when your order is ready to be picked up. Until then, feel free to browse the menu or place another order!</T>
        <T style={StyleSheet.flatten([Styles.headerText, Styles.orderStatus])} type="h2">Your order is currently being made</T>
      </StatusCardBase>
    );
  }

  render() {
    return (
      <View>
        {this.props.makingOrders.map((value) => this.renderMakingOrder(value))}
      </View>
    );
  }
}
