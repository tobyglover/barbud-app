import React, { Component } from 'react';
import {View, 
  StyleSheet, 
  ScrollView,
  ActivityIndicator} from 'react-native';

import T from '../../widgets/T';
import {raiseErrorMessage} from '../../../helpers/Helpers';

const BULLET = '\u25CF';
const SECT = '\u00A7';
const baseDisclaimerStyle = {
  paddingVertical: 10
};

const Styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loadingContainer: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollView: {
    marginHorizontal: 10
  },
  title: {
    ...baseDisclaimerStyle,
    fontSize: 24,
    textAlign: 'center'
  },
  p: {
    ...baseDisclaimerStyle
  }
}); 

export default class SignUpDisclaimer extends Component {
  componentWillMount() {
    this.uniquekey = 0;
    this.textColor = this.props.textColor || "black";
    this.props.disclaimerAPIStatus !== 'success' && this.props.fetchDisclaimer();
  }

  getUniqueKey() {
    this.uniquekey++;
    return "key" + this.uniquekey;
  }

  formatText(text, index, listType) {
    switch (listType) {
      case 'alpha':
        return String.fromCharCode(97 + index) + ". " + text;
      case 'numeric':
        return (1 + index) + ". " + text;
      case 'legal':
        return SECT + " " + text;
      case 'bullet':
        return BULLET + " " + text;
      default:
        return text
    }
  }

  parseDisclaimerObject(val, index, listType) {
    let parsedObject = null;
    
    if (val.type == "title") {
      parsedObject = <T key={this.getUniqueKey()} style={StyleSheet.flatten([Styles.title, {color: this.textColor}])}>{this.formatText(val.text, index, listType)}</T>
    } else if (val.type == "list") {
      parsedObject = 
        <View key={this.getUniqueKey()}> 
          {val.list.map((listvals, index) => this.parseDisclaimerObject(listvals, index, val.listType))}
        </View>;
    } else {
      parsedObject = <T key={this.getUniqueKey()} style={StyleSheet.flatten([Styles.p, {color: this.textColor}])} weight={listType == "numeric" ? "bold" : 'normal'}>{this.formatText(val.text, index, listType)}</T>
    }

    if (val.subContent) {
      return (
        <View key={this.getUniqueKey()}>
          {parsedObject}
          {val.subContent.map((listvals, index) => this.parseDisclaimerObject(listvals, index))}
        </View>
      );
    } else {
      return parsedObject;
    }
  }

  parseDisclaimer() {
    const disclaimerJson = this.props.disclaimer;
    
    return disclaimerJson.map((val, index) => this.parseDisclaimerObject(val, index));
  }

  render() {
    if (this.props.disclaimerAPIStatus == 'error') {
      raiseErrorMessage("There was an error loading our disclaimer.")
      return null;
    }

    const disclaimer = this.props.disclaimerAPIStatus === 'success' ? 
                        this.parseDisclaimer() : 
                        <View style={Styles.loadingContainer}>
                          <ActivityIndicator
                            size="large"/>
                          <T style={{color: this.props.textColor || "black"}}>Fetching Terms and Conditions</T>
                        </View>;
    return (
      <View style={Styles.container}>
        <ScrollView>
          <View style={Styles.scrollView}>
            {disclaimer}
          </View>
        </ScrollView>
      </View>
    );
  }
}

