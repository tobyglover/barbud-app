import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Modal
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import T from '../../../widgets/T';
import SafeAreaView from '../../../widgets/SafeAreaView';
import NavigationImage from '../../../widgets/NavigationImage';
import {orange} from '../../../../statics/colors';
import {FillBackgroundWhite} from '../../../../statics/styles';
import TipsContainer from '../../../../containers/core/statuscard/TipsContainer'
import WindowDimensions from '../../../../helpers/WindowDimensions'

const WINDOW_WIDTH = WindowDimensions.width;
const Styles = StyleSheet.create({
  close: {
    marginLeft: 20,
    marginTop: 20
  },
  contentContainer: {
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 10,
  },
  codeContainer: {
    borderWidth: 1,
    borderRadius: 10,
    height: WINDOW_WIDTH - 50,
    width: WINDOW_WIDTH - 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  code: {
    color: orange,
    backgroundColor: 'transparent'
  },
  explainerText: {
    textAlign: 'center',
    marginBottom: 25
  },
});

export default class OrderCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codeFontSize: 300,

    };
  }

  onCodeLayout(evt) {
    if (evt.nativeEvent.layout.height > WINDOW_WIDTH) {
      // has overflowed
      this.setState({codeFontSize: this.state.codeFontSize - 5})
    }
  }

  render() {
    if (this.props.visible) {
      const bartender = this.props.order.bartender.nickname || this.props.order.bartender.name;
      return (
        <Modal
          animationType="fade"
          transparent={false}
          visible={this.props.visible}
          onRequestClose={this.props.onDismiss}>
          <SafeAreaView color="white">
            <View style={FillBackgroundWhite}>
              <NavigationImage
                style={Styles.close}
                type="x"
                color="orange"
                clickable={true}
                onPress={this.props.onDismiss}/>
              <KeyboardAwareScrollView
                extraHeight={200}>
                <View style={Styles.contentContainer}>
                  <T type="h1">Your Order is Ready!</T>
                  <View style={Styles.codeContainer}>
                    <T onLayout={this.onCodeLayout.bind(this)}style={StyleSheet.flatten([Styles.code, {fontSize: this.state.codeFontSize}])}>{this.props.order.verificationCode}</T>
                  </View>
                  <T type="h2" style={Styles.explainerText}>{`Show this code to ${bartender} to pickup your order`}</T>
                  <TipsContainer
                    order={this.props.order}
                    prompt={`Leave a Tip For ${bartender}`}/>
                </View>
              </KeyboardAwareScrollView>
            </View>
          </SafeAreaView>
        </Modal>)
    } else {
      return null;
    }
  }
}
