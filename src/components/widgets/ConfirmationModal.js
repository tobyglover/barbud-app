import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

import Modal from '../widgets/Modal';
import Button from '../widgets/Button';
import T from '../widgets/T';

const Styles = StyleSheet.create({
  promptText: {
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  altButtonContainer: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: 1
  },
  buttonExtraTopPadding: {
    flex: 1,
    paddingTop: 15
  }
});

export default class ConfirmationModal extends Component {
  dismiss() {
    this.modal.dismiss();
  }

  render() {
    let buttons = null;
    if (this.props.isCancelButtonSmall) {
      buttons = 
        <View style={Styles.altButtonContainer}>
          <Button
            containerStyle={Styles.button}
            text={this.props.confirmButtonText}
            onPress={() => this.props.onResponse(true)}/>
          <Button
            containerStyle={Styles.buttonExtraTopPadding}
            type="text"
            text={this.props.cancelButtonText}
            textProps={{style: {fontSize: 20}}}
            onPress={() => this.props.onResponse(false)}/>
        </View>;
    } else {
      buttons = 
        <View style={Styles.buttonContainer}>
          <Button
            containerStyle={Styles.button}
            text={this.props.cancelButtonText}
            onPress={() => this.props.onResponse(false)}/>
          <Button
            containerStyle={Styles.button}
            text={this.props.confirmButtonText}
            type="CTAButtonRed"
            onPress={() => this.props.onResponse(true)}/>
        </View>
    }

    return (
      <Modal
        ref={(r) => this.modal = r}
        dismissable={false}
        {...this.props}>
        {this.props.children}
        {this.props.message && <T type="h3" style={Styles.promptText}>{this.props.message}</T>}
        {buttons}
      </Modal>
    );
  }
}
