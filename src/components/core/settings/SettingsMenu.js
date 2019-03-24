import React, { Component, PureComponent } from 'react';
import { 
  View,
  StyleSheet,
  TouchableHighlight } from 'react-native';

import NavigationImage from '../../widgets/NavigationImage'

const Styles = StyleSheet.create({
  sectionContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: 'ghostwhite',
    marginBottom: 50
  },
  sectionItem: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionSeparator: {
    marginLeft: 30,
    marginRight: 10,
    borderWidth: .5,
    borderColor: 'lightgray'
  },
  content: {
    flex: 1
  },
});

export class Section extends Component {
  render() {
    return (
      <View style={Styles.sectionContainer}>
        {this.props.children}
      </View>
    );
  }
}

export class SectionItem extends Component {
  render() {
    const navigationImage = this.props.showNavImage && 
                              <NavigationImage 
                                type="arrow"
                                color="orange"
                                size={this.props.navImageSize || 20}/>
      return (
        <TouchableHighlight
          onPress={this.props.onPress}
          underlayColor="lightgray">
          <View style={Styles.sectionItem}>
            {this.props.icon}
            <View style={Styles.content}>
              {this.props.children}
            </View>
            {navigationImage || this.props.endComponent}
          </View>
        </TouchableHighlight>
      );
  }
}

export class SectionSeparator extends PureComponent {
  render() {
    return <View style={Styles.sectionSeparator}/>;
  }
}
