import React, { Component } from 'react';
import { View,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

import T from '../../widgets/T';
import Badge, {SIZE} from '../../widgets/Badge';
import NavigationImage from '../../widgets/NavigationImage';

import {formatPriceInCents} from '../../../helpers/Helpers';
import {orange} from '../../../statics/colors';

const Styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDescContainer: {
    flex: 1
  },
  viewWithBottomPadding: {
    paddingBottom: 10
  },
  seperator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'black',
  },
  itemDescRow: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  badge: {
    marginRight: 10
  },
  itemName: {
    color: orange,
    flex: 1,
    paddingRight: 10
  },
});

export default class DrinkItem extends Component {
  render() {
    const price = this.props.showTotal ? this.props.item.priceInCents * this.props.quantity : this.props.item.priceInCents;
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        underlayColor='lightgray'
        style={this.props.style}>
        <View style={Styles.itemContainer}> 
          <View style={Styles.badge}>
            <Badge 
              number={this.props.quantity} 
              hideIfZero={true}
              {...this.props.badgeProps}/> 
          </View>
          <View style={Styles.itemDescContainer}>
            <View style={StyleSheet.flatten([Styles.viewWithBottomPadding, this.props.showSeperator && Styles.seperator])}> 
              <View style={Styles.itemDescRow}>
                <T type="h2" style={Styles.itemName}>{this.props.item.name}</T>
                <T type="h4">{formatPriceInCents(price)}</T>
              </View>
              <T>{this.props.item.description}</T>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
