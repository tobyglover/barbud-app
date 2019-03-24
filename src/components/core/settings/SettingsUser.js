import React, { Component } from 'react';
import { 
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LiteCreditCardInput } from 'react-native-credit-card-input';
import * as Animatable from 'react-native-animatable';
import {StripeCardBrandToCardTypes, prettyCardNumber} from '../../../helpers/Helpers';
import Icons from 'react-native-credit-card-input/src/Icons';

import SignUpPaymentInfoContainer from '../../../containers/signup/SignUpPaymentInfoContainer';

import T from '../../widgets/T';
import NavigationImage from '../../widgets/NavigationImage';
import TextInputWithLabel from '../../widgets/TextInputWithLabel'
import Button from '../../widgets/Button'
import PhoneNumberInput from '../../widgets/PhoneNumberInput'
import Modal from '../../widgets/Modal';

import {FillBackgroundWhite} from '../../../statics/styles';
import {semitranslucentgray, orange} from '../../../statics/colors';

const CREDIT_CARD_BRAND_SIZE = 50;
const ADD_CREDIT_CARD_SIZE = 25;

export const Styles = StyleSheet.create({
  header: {
    fontSize: 36,
    marginLeft: 10
  },
  section: {
    marginLeft: 15
  },
  lastSection: {
    marginBottom: 10
  },
  sectionHeader: {
  },
  creditCardInput: {
    borderRadius: 3,
    borderWidth: 1,
    margin: 5,
    marginBottom: 18
  },
  changesList: {
    marginVertical: 10,
    marginLeft: 25,
    flexDirection: 'row'
  },
  changeListItemLabels: {
    marginRight: 5 
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: -10
  },
  button: {
    flex: 1
  }, 
  currentPassword: { 
    marginTop: 15
  },
  loadingContainer: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    height: '100%',
    width: '100%',
    backgroundColor: semitranslucentgray,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingDialog: {
    opacity: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 3
  },
  creditCardBrand: {
    width: CREDIT_CARD_BRAND_SIZE, 
    height: CREDIT_CARD_BRAND_SIZE,
    marginRight: 10
  },
  creditCardItem: {
    flexDirection: 'row',
    marginHorizontal: 5,
    paddingHorizontal: 5,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'black'
  },
  cardNumber: {
    flex: 1
  },
  addCardButton: {
    marginVertical: 10,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  circleAddCardButton: {
    width: CREDIT_CARD_BRAND_SIZE - 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: orange,
    marginRight: 10,
    padding: 3
  }
});

export default class SettingsUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmModalVisible: false,
      invalidModelVisible: false,
      showAddNewCard: false
    };
    this.isUpdating = false;
    this.labelNames = {
      name: "Name",
      email: "Email",
      phone: "Phone Number",
      currentPassword: "Current Password",
      password: "New Password",
      passwordConfirm: "Re-enter New Password",
      creditCard: "Credit Card"
    }
  }

  componentWillMount() {
    this.props.screenProps.registerGoBackCaller(this.goBack.bind(this));
  }

  goBack() {
    this.props.navigation.goBack();
    this.props.resetNewUserInfo();
  }

  resetIfEmpty(key) {
    if (this.props.newUserInfo[key] === '') {
      this.props.onChangeUserInfo(key, null);
    }
  }

  changeInfo() {
    this.setState({confirmModalVisible: false});
    if (this.props.invalidPassword) {
      this.setState({invalidModelVisible: true});
    } else {
      this.isUpdating = true;
      this.props.sendUserInfoChanges();
    }
  }

  onDismissInvalidModel() {
    this.setState({invalidModelVisible: false});
    this.confirmChangeInfo();
  }

  confirmChangeInfo() {
    this.props.onChangeUserInfo("currentPassword", null);
    this.setState({confirmModalVisible: true});
  }

  onDismissConfirmModal() {
    this.setState({confirmModalVisible: false});
  }

  renderTextInput(key, type) {
    let textInputProps = {};
    if (type == "secure") {
      textInputProps = {secureTextEntry:true,
                        returnKeyType:'done'};
    } else if (type == "email") {
      textInputProps = {keyboardType:'email-address',
                         autoCapitalize: 'none',
                         autoCorrect: false,
                         returnKeyType:'done'};
    } else {
      textInputProps = {autoCapitalize:'words',
                        returnKeyType:'done'};
    }
    return (
      <TextInputWithLabel
        borderColor={this.props.newUserInfo[key] ? "green" : "black"}
        label={this.labelNames[key]}
        activeLabelColor={this.props.newUserInfo[key] && 'green'}
        value={this.props.newUserInfo[key] != null ? this.props.newUserInfo[key] :  this.props.userInfo[key]}
        validationMessage={this.props.newUserInfoValidation[key]}
        onChangeText={(t) => this.props.onChangeUserInfo(key, t)}
        onBlur={() => this.resetIfEmpty(key)}
        textInputProps={textInputProps}/>
    );
  }

  renderLoadingModal() {
    if (this.props.apiStatus == "loading") {
      // this should be a modal, but it breaks for some reason 
      // (maybe too many modals in one view?)
      return (
        <View style={Styles.loadingContainer}>
          <View style={Styles.loadingDialog}>
            <ActivityIndicator size="large" />
            <T type="h3">Updating Your Info</T>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }

  renderInvalidModal() {
    return (
      <Modal
        ref={(r) => this.invalidModal = r}
        title="Invalid Password"
        animate={true}
        dismissable={false}
        visible={this.state.invalidModelVisible}
        onDismiss={this.onDismissInvalidModel.bind(this)}>
        <View>
          <T type="h3">Please enter your current password correctly in order to make changes</T>
          <Button 
            text="OK"
            onPress={() => this.invalidModal && this.invalidModal.dismiss()}/>
        </View>
      </Modal>
    );
  }

  raiseMessage(message, onDismiss) {
    return (
      <Modal
        ref={(r) => this.messageModal = r}
        animate={true}
        noHeader={true}
        visible={true}
        onDismiss={onDismiss}
        fake={true}>
        <View>
          <T type="h3" style={{textAlign: 'center'}}>{message}</T>
          <Button 
            text="OK"
            onPress={() => this.messageModal && this.messageModal.dismiss()}/>
        </View>
      </Modal>
    );
  }

  renderCreditCards() {
    return Array.isArray(this.props.userInfo.cards) && this.props.userInfo.cards.map((value, index) => {
      const cardType = StripeCardBrandToCardTypes[value.brand] || StripeCardBrandToCardTypes.Unknown;
      return (
        <View style={Styles.creditCardItem} key={index}>
          <Image 
            style={Styles.creditCardBrand}
            resizeMode="contain"
            source={Icons[cardType]}/>
          <T style={Styles.cardNumber}>{prettyCardNumber(value.last4, cardType)}</T>
          {value.isDefault && <T>(Default)</T>}
        </View>
      );
    })
  }

  dismissAddCardModal() {
    this.setState({showAddNewCard: false})
  }

  renderAddNewCreditCardButton() {
    return (
      <TouchableOpacity
        onPress={() => this.setState({showAddNewCard: true})}>
        <View style={Styles.addCardButton}>
          <View style={Styles.circleAddCardButton}>
            <NavigationImage
              type="+"
              color="orange"
              size={ADD_CREDIT_CARD_SIZE}
              clickable={false}/>
          </View>
          <T type="h4">Add a new card</T>
        </View>
      </TouchableOpacity>
    );
  }

  renderConfirmModal() {
    const bullet = '\u25CF';
    let changedItemsLabels = [];
    let changedItemsValues = [];
    for (let key in this.props.newUserInfo) {
      if (key !== "currentPassword" && key !== "passwordConfirm" && this.props.newUserInfo[key]) {
        let value = this.props.newUserInfo[key];
        if (key === "password") {
          value = bullet.repeat(value.length);
        } else if (key == "creditCard" && value.number.length > 4) {
          value = bullet.repeat(value.number.length - 4) + value.number.substr(-4);
        }
        changedItemsLabels.push(<T type="h4" style={Styles.changeListItemLabel} weight="bold" key={key + "label"}>{this.labelNames[key]}</T>);
        changedItemsValues.push(<T type="h4" style={Styles.changeListItemValue} key={key + "value"}>{value}</T>)
      }
    }
    return (
      <Modal
        ref={(r) => this.confirmModal = r}
        title="Are You Sure?"
        animate={true}
        dismissable={true}
        scrollable={true}
        visible={this.state.confirmModalVisible}
        onDismiss={this.onDismissConfirmModal.bind(this)}>
        <View style={Styles.confirmModal}>
          <T type="h3" style={{textAlign:'center'}}>Enter your current password to make the following changes</T>
          <View style={Styles.changesList}>
            <View style={Styles.changeListItemLabels}>
              {changedItemsLabels}
            </View>
            <View>
              {changedItemsValues}
            </View>
          </View>
          <View style={Styles.currentPassword}>
            {this.renderTextInput("currentPassword", "secure")}
          </View>
          <View style={Styles.buttonRow}>
            <Button 
              containerStyle={Styles.button}
              text="Cancel"
              type="CTAButtonGray"
              onPress={() => this.confirmModal && this.confirmModal.dismiss()}/>
            <Button 
              containerStyle={Styles.button}
              text="Confirm"
              disabled={!this.props.newUserInfo.currentPassword}
              onPress={this.changeInfo.bind(this)}/>
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    let message = null;
    if (this.isUpdating) {
      if (this.props.apiStatus === "error") {
        message = this.raiseMessage("There was an error changing your info. Please try again later", () => {
          this.isUpdating = false;
          this.props.dismissApiStatus();
        });
      } else if (this.props.apiStatus === "success") {
        message = this.raiseMessage("Congrats! Your information has been successfully updated.", () => {
          this.isUpdating = false;
          this.props.dismissApiStatus();
          this.goBack();
        }, "Success");
      }
    }
    
    return (
      <View style={FillBackgroundWhite}>
        <KeyboardAwareScrollView
          keyboardOpeningTime={150}>
          <T type="h1" style={Styles.header}>Edit Your Info</T>
          <View style={Styles.section}>
            <T type="h2" style={Styles.sectionHeader}>Personal Info</T>
            {this.renderTextInput("name")}
            {this.renderTextInput("email", "email")}
            <PhoneNumberInput
              activeLabelColor={this.props.newUserInfo["phone"] && 'green'}
              borderColor={this.props.newUserInfo["phone"] ? "green" : "black"}
              value={this.props.newUserInfo.phone != null ? this.props.newUserInfo.phone :  this.props.userInfo.phone}
              validationMessage={""}
              onChangeNumber={(t) => this.props.onChangeUserInfo("phone", t)} />
          </View>
          <View style={Styles.section}>
            <T type="h2" style={Styles.sectionHeader}>Payment Info</T>
            {this.renderCreditCards()}
            {this.renderAddNewCreditCardButton()}
          </View>
          <View style={StyleSheet.flatten([Styles.section, Styles.lastSection])}>
            <T type="h2" style={Styles.sectionHeader}>Password</T>
              {this.renderTextInput("password", "secure")}
              {this.renderTextInput("passwordConfirm", "secure")}
          </View>
        </KeyboardAwareScrollView>
        <Button
          text="Change Info"
          disabled={!this.props.buttonEnabled}
          onPress={this.confirmChangeInfo.bind(this)}/>
        {message}
        {this.renderInvalidModal()}
        {this.renderConfirmModal()}
        {this.renderLoadingModal()}
        <SignUpPaymentInfoContainer
          visible={this.state.showAddNewCard}
          onDismiss={this.dismissAddCardModal.bind(this)}/>
      </View>
    );
  }
}
