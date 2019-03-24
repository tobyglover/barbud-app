// Renders arrows. 
// TODO: allow for arbitrary direction and color of button

import React, { Component } from 'react';
import NavigationImage from './NavigationImage';

export default class Arrow extends Component {
  render() {
    const color = this.props.type || "white";
    return (
      <NavigationImage 
        type="arrow"
        color={color}
        size={this.props.size}
        onPress={this.props.onPress}
        clickable={this.props.clickable}/>
    );
  }
} 
