import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
} from 'react-native';

import DrinkItem from './DrinkItem';

const Styles = StyleSheet.create({
  drinkItem: {
    paddingHorizontal: 10,
  }
});

export default class DrinkList extends Component {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }

  renderItem(item, index) {
    const quantity = this.props.order[item.uuid] ? this.props.order[item.uuid].quantity : 0;
    item.categoryId = this.props.category.uuid;
    item.barId = this.props.barId;
    return (
      <DrinkItem 
        style={Styles.drinkItem}
        onPress={this.props.onDrinkItemPressed ? () => this.props.onDrinkItemPressed(item) : undefined}
        quantity={quantity}
        item={item}
        key={item.uuid}
        showSeperator={index < this.props.category.drinks.length - 1}/>
    );
  }

  getItems() {
    return this.props.category.drinks.map((value, index) => this.renderItem(value, index));
  }

  render() {
    return (
      <ScrollView
        containerStyle={Styles.container}
        renderItem={this.renderItem}>
        {this.getItems()}
      </ScrollView>
    ); 
  }
}
