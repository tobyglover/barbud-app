import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import T from '../../../widgets/T';
import NavigationImage from '../../../widgets/NavigationImage';
import {orange} from '../../../../statics/colors'
import {formatTipPercentage} from '../../../../helpers/Helpers'
import * as Animatable from 'react-native-animatable';

const Styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'white'
  },
  mainComponent: {
    color: 'black'
  },
  selectedMainComponent: {
    color: 'green'
  },
  percentage: {
    color: 'darkgray',
    textAlign: 'center'
  },
  selectedPercentage: {
    color: 'lightgreen',
    textAlign: 'center'
  },
  loadingContainer: {
    position: 'absolute',
    height: '100%',
    left: 0,
    marginLeft: 10,
    justifyContent: 'center',
  }
});

export default class TipButton extends Component {
  constructor(props) {
    super(props);
    this.state = {selected: false};
  }

  componentWillMount() {
    this.buttonStyle = StyleSheet.flatten({
      width: '100%',
      height: this.props.width,
      borderRadius: this.props.width / 2,
      borderColor: orange,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.unselect && this.state.selected) {
      this.setState({selected: false});
      this.props.onUnselect && this.props.onUnselect();
    }
  }

  toStringPercentage() {
    return formatTipPercentage(this.props.percentage);
  }

  onPress() {
    this.setState({selected: true});
    this.props.onSelect();
  }

  render() {
    const selected = this.props.selected || this.state.selected;
    const mainComponentStyle = selected ? Styles.selectedMainComponent : Styles.mainComponent;
    const percentageStyle = selected ? Styles.selectedPercentage : Styles.percentage;
    const borderStyle = StyleSheet.flatten([this.buttonStyle, this.props.apiStatus == "success" ? {borderColor: 'green'} : 
                        selected && this.props.selectedColor ? {borderColor: this.props.selectedColor} : null])
    const apiStatusContainer = 
      <View style={Styles.loadingContainer}> 
        {this.props.apiStatus == "loading" ? 
          <ActivityIndicator /> : 
          this.props.apiStatus == "success" ? 
            <NavigationImage 
              type="checkmark"
              color="green"
              clickable={false} /> : null}
      </View>


    let button = 
        <View style={borderStyle}>
          {apiStatusContainer}
          <View style={this.props.buttonContainerStyle}>
            {this.props.mainComponent ? this.props.mainComponent : null}
            {this.props.mainText ? <T style={mainComponentStyle}>{this.props.mainText}</T> : null}
            {typeof this.props.percentage == "number" ? <T style={percentageStyle}>{this.toStringPercentage()}</T> : null}
          </View>
        </View>;
    let containerStyle = null;
    if (selected) {
      containerStyle = {
        left: 0,
        width: this.props.containerWidth,
        zIndex: 2};
    } else {
      containerStyle = {
        left: this.props.startPosition, 
        width: this.props.width,
        zIndex: 1};
      button = <TouchableOpacity
        onPress={this.onPress.bind(this)}>
        {button}
      </TouchableOpacity>
    }

    return (
      <Animatable.View 
        transition={['width', 'left']}
        duration={200}
        style={StyleSheet.flatten([Styles.container, containerStyle])}>
        {button}
      </Animatable.View>
    );
  }
} 
