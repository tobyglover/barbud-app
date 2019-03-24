// Gets Payment info (CC #, exp date, billing info, etc.) from user

import React, { Component } from 'react';
import {
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Modal as NativeModal} from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CardIOModule } from 'react-native-awesome-card-io';

import SignedOutScreenBase from '../SignedOutScreenBase';

import LoadingIndicator from '../../widgets/LoadingIndicator';
import Modal from '../../widgets/Modal';
import T from '../../widgets/T';
import Button from '../../widgets/Button';
import NavigationImage from '../../widgets/NavigationImage';

import {orange} from '../../../statics/colors';

const CAMERA_SIZE = 40;
const Styles = StyleSheet.create({
  container: {
    margin: 10,
    flex: 1
  },
  white: {
    color: 'white'
  },
  borderWhite: {
    borderBottomWidth: 1,
    borderBottomColor: 'white'
  },
  scanCardContainer: {
    alignItems: 'center',
    width: '100%'
  },
  scanCardButtonContainer: {
    width: '100%',
    marginVertical: 20,
    maxWidth: 300
  },
  scanCardButton: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: orange,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  scanCardText: {
    paddingLeft: 15,
    marginRight: CAMERA_SIZE,
    color: orange,
    fontSize: 20
  },
  nextButtonContainer: {
    padding: 5,
    alignItems: 'center',
    width: '100%',
  },
  centerText: {
    textAlign: 'center'
  },
  noticeText: {
    paddingHorizontal: 5,
    textAlign: 'center',
    color: 'white'
  }
});

export default class SignUpPaymentInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      card: null
    }
  }

  setValues(data) {
    // Bug in CreditCardInput if empty string is set. Need to check values first
    let values = {};
    if (data.number) values['number'] = data.number;
    if (data.exp_month) values['expiry'] = data.exp_month;
    if (data.exp_year) values['expiry'] = values['expiry'] + data.exp_year;
    if (data.cvc) values['cvc'] = data.cvc;
    this.creditCardInput.setValues(values);
  }

  scanCard() {
    CardIOModule
      .scanCard({
        hideCardIOLogo: true,
        suppressManualEntry: true,
        requireExpiry: false,
        requireCVV: false
      })
      .then(card => {
        this.setValues({
          number: card.cardNumber,
        });
      })
      .catch(() => {
        // the user cancelled
      })
  }

  onChangeInfo(card) {
    this.setState({card});
  }

  addCard() {
    this.props.addCardToUser(this.state.card);
  }

  statusModalButtonPressed() {
    if (this.props.apiStatus == 'success') {
      setTimeout(this.props.onDismiss, 100);
    }
    this.props.resetApiStatus();
  }

  render() {
    return (
      <NativeModal
        animationType="slide"
        transparent={false}
        visible={this.props.visible}
        onRequestClose={this.props.onDismiss}>
        <SignedOutScreenBase
          useX
          addSafeArea
          equalHeaderMargins={this.props.statusBarIsHidden}
          onBackPressed={this.props.onDismiss}
          headerText="New Card Details">
          <KeyboardAwareScrollView>
            <View style={Styles.container}>
              <CreditCardInput 
                ref={(r) => this.creditCardInput = r}
                onChange={this.onChangeInfo.bind(this)} 
                labelStyle={Styles.white}
                inputStyle={Styles.white}
                inputContainerStyle={Styles.borderWhite}
                allowScroll={true}
                cardImageFront={require('../../../statics/images/cardFront.png')}
                cardImageBack={require('../../../statics/images/cardBack.png')}/>
              <View
                style={Styles.scanCardContainer}>
                <TouchableOpacity
                  style={Styles.scanCardButtonContainer}
                  onPress={this.scanCard.bind(this)}>
                  <View style={Styles.scanCardButton}>
                    <NavigationImage
                      type="camera"
                      color="white"
                      size={CAMERA_SIZE}
                      clickable={false}/>
                    <T style={Styles.scanCardText}>Scan Card</T>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
          <View style={Styles.nextButtonContainer}>
            <Button
              text="Add Card"
              disabled={this.state.card && this.state.card.invalid}
              onPress={this.addCard.bind(this)}/>
            <T style={Styles.noticeText}>A small, temporary charge will be made to confirm the card is active</T>
          </View>
        </SignedOutScreenBase>
        {this.props.apiStatus == 'loading' && <LoadingIndicator text="Adding Card"/>}
        <Modal
          noHeader
          dismissable={false}
          ref={(r) => this.statusModal = r}
          visible={this.props.apiStatus == "success" || this.props.apiStatus == 'error'}>
          <T style={Styles.centerText}type="h1">{
            this.props.apiStatus == 'success' ?
              "Your card has been successfully added!" : 
              "There was an error adding your card. Please try again."}</T>
          <Button
            text="OK"
            onPress={this.statusModalButtonPressed.bind(this)}/>
        </Modal>
      </NativeModal>);
  }
}


