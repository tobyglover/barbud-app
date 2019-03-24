import React, { Component } from 'react';
import {TouchableOpacity, Image} from 'react-native'; 

const hitSlop = 10;
const assets = {
  arrow: {
    orange: require('../../statics/images/orange_arrow.png'),
    white: require('../../statics/images/white_arrow.png')
  },
  x: {
    orange: require('../../statics/images/orange_x.png')
  },
  "-": {
    orange: require('../../statics/images/orange_-.png')
  },
  "+": {
    orange: require('../../statics/images/orange_+.png')
  },
  gear: {
    white: require('../../statics/images/gear.png')
  },
  mail: {
    black: require('../../statics/images/mail.png')
  },
  checkmark: {
    white: require('../../statics/images/white_checkmark.png'),
    green: require('../../statics/images/green_checkmark.png')
  },
  camera: {
    white: require('../../statics/images/white_camera.png')
  }
};

export default class NavigationImage extends Component {
  render() {
    const size = this.props.size || 30;
    const source = assets[this.props.type][this.props.color];
    const image = 
      <Image 
        style={{width: size, height: size}}
        source={source}
        resizeMode="contain"/>
    if (!this.props.clickable) {
      return image;
    }
    return (
      <TouchableOpacity 
        style={this.props.style}
        onPress={this.props.onPress}
        activeOpacity={.5}
        hitSlop={{top: hitSlop, left: hitSlop, bottom: hitSlop, right: hitSlop}}>
        {image}
      </TouchableOpacity>
    );
  }
} 
