import React, { Component } from 'react';
import {
  View,
  StyleSheet, 
  ActivityIndicator,
} from 'react-native';

import ViewPager from '../../widgets/ViewPager';
import Button from '../../widgets/Button';
import DrinkList from './DrinkList';

const Styles = StyleSheet.create({
  statusContainer: {
    height: '100%', 
    width: '100%', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  viewPagerContainer: {
    flex: 1,
    zIndex: 1
  },
});

export default class Menu extends Component {
  getMenuPages() {
    return !this.props.menu ? [] : 
      this.props.menu.map(value => {
        return {
          key: value.uuid,
          component: DrinkList,
          header: value.name,
          props: {
            category: value,
            barId: this.props.bar.uuid,
            onDrinkItemPressed: this.props.onDrinkItemPressed,
            order: this.props.order
          }
        }
      });
  }

  render() {
    let menu = 
        <View style={Styles.viewPagerContainer}>
          <ViewPager showHeaders={true} pages={this.getMenuPages()}/>
        </View>;
    if (this.props.apiStatus == 'loading') {
      menu= 
        <View style={Styles.statusContainer}>
          <ActivityIndicator 
            size='large'/>
        </View>;
    } else if (this.props.apiStatus == 'error') {
      menu =
        <View style={Styles.statusContainer}>
          <Button 
            type="text"
            textProps={{style: {fontSize: 20, color: 'gray'}}}
            text="Error loading menu. Tap to retry."
            onPress={this.props.onRefresh}/>
        </View>
    }

    return menu;
  }
}
