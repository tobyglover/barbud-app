import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

const Styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    marginVertical: 7,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: 'white',
}});

export default class StatusCardBase extends PureComponent {
  setNativeProps(props) {
    this.view && this.view.setNativeProps(props);
  }

  render() {
    return (
      <View 
        ref={(r) => this.view = r}
        style={StyleSheet.flatten([Styles.container, this.props.style])}>
        {this.props.children}
      </View>
    );
  }
}
