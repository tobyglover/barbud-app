import React, { Component } from 'react';
import { 
  View,
  StyleSheet,
  Alert, 
  ScrollView,
  ActivityIndicator,
  Switch } from 'react-native';
import moment from 'moment';

import {raiseErrorMessage, sendFeedBackEmail} from '../../../helpers/Helpers'
import Notifications from '../../../helpers/Notifications';

import {Section, SectionItem, SectionSeparator} from './SettingsMenu'
import T from '../../widgets/T';
import Button from '../../widgets/Button';
import TextInputWithLabel from '../../widgets/TextInputWithLabel'
import NavigationImage from '../../widgets/NavigationImage'
import Modal from '../../widgets/Modal'

import {FillBackgroundWhite} from '../../../statics/styles';
import {email} from '../../../statics/strings';

const OTHER_ICON_SIZE = 35;

const Styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  userIcon: {
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userIconText: {
    backgroundColor: 'transparent',
    fontSize: 52,
    padding: 8,
    color: 'white'
  },
  userInfo: {
    marginLeft: 5
  },
  otherItemIcon: {
    width: OTHER_ICON_SIZE,
    height: OTHER_ICON_SIZE,
    marginRight: 5,
    borderRadius: 4,
    backgroundColor: '#b2b2b2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  otherItemIconText: {
    color: "black"
  },
});

export default class SettingsHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userIconSize: null,
      showEmailModal: false
    };
  }

  componentWillMount() {
    if (!this.props.userInfo) {
      this.props.getUserInfo();
    }
  }

  goTo(screen) {
    this.props.navigation.navigate(screen);
  }

  getUserInitials() {
    return this.props.userInfo && this.props.userInfo.name && this.props.userInfo.name.split(" ").reduce(
      (a, x) =>  a + x.charAt(0).toUpperCase(), "");
  }

  formatBirthday() {
    return this.props.userInfo && this.props.userInfo.dateOfBirth ? moment(this.props.userInfo.dateOfBirth).format("MMMM Do, YYYY") : "";
  }

  onUserIconTextLayout(evt) {
    const {width, height} = evt.nativeEvent.layout;
    this.setState({userIconSize: Math.max(width, height)});
  }

  sendEmail() {
    const canOpenMailtoUrl = sendFeedBackEmail();
    this.setState({showEmailModal: !canOpenMailtoUrl});
  }

  logout() {
    Notifications.unregisterDeviceToUser();
    this.props.logout();
  }

  confirmLogout() {
    Alert.alert(
      'Are you sure?',
      'Are you sure you want to log out?',
    [{text: 'Log Out', style: 'destructive', onPress: this.logout.bind(this)},
      {text: 'Cancel', style: 'default'}],
    {cancelable: false}
    )
  }

  changeUserProduction() {
    Alert.alert(
      'Are you sure?',
      'Are you sure you want to switch? Doing so will cause you to logout.',
    [{text: 'Log Out', style: 'destructive', onPress: () => {
      this.logout();
      this.props.setShouldUseStaging(!this.props.useStaging);
    }},
      {text: 'Cancel', style: 'default'}],
    {cancelable: false}
    );
  }

  renderInternalSettings() {
    if (this.props.userInfo.isTest) {
      return (
        <View>
          <View style={{padding: 10}}>
            <T type="h1">Internal Settings</T>
            <T type="h3">Not visible to customers</T>
          </View>
          <Section>
            <SectionItem
              endComponent={<Switch 
                              value={this.props.useStaging}
                              onValueChange={this.changeUserProduction.bind(this)}/>}>
              <T type="h3">Test Mode</T>
            </SectionItem>
          </Section>
        </View>
      );
    }
  }

  render() {
    if (this.props.apiStatus === "error") {
      raiseErrorMessage("There was an error retrieving your info. Please try again later.");
      return null;
    } else if (this.props.apiStatus == "loading" || !this.props.userInfo) {
      return (
        <View style={FillBackgroundWhite}>
          <View style={Styles.loadingContainer}>
            <ActivityIndicator size="large"/>
            <T type="h4">Loading Your Info</T>
          </View>
        </View>
      );
    } else {
      const userIconStyle = this.state.userIconSize ? 
            StyleSheet.flatten([Styles.userIcon, {
              borderRadius: (this.state.userIconSize) / 2,
              width: this.state.userIconSize,
              height: this.state.userIconSize
            }]) : Styles.userIcon;

      return (
        <View style={FillBackgroundWhite}>
          <ScrollView>
            <Section>
              <SectionItem
                onPress={() => this.goTo("User")}
                icon={this.props.userInfo && this.props.userInfo.name &&
                  <View style={userIconStyle}>
                    <T type="h1" style={Styles.userIconText} onLayout={this.state.userIconSize ? null : this.onUserIconTextLayout.bind(this)}>{this.getUserInitials()}</T>
                  </View>}
                showNavImage={true}
                navImageSize={25}>
                <View style={Styles.userInfo}>
                  {this.props.userInfo.name && <T type="h1">{this.props.userInfo.name}</T>}
                  {this.props.userInfo.dateOfBirth && <T type="h3">{this.formatBirthday()}</T>} 
                  <T type="h3">{this.props.userInfo.email}</T>
                </View>
              </SectionItem>
            </Section>
            <Section>
              <SectionItem
                onPress={() => this.goTo("About")}
                icon={
                  <View style={Styles.otherItemIcon}>
                    <T type="h1" style={Styles.otherItemIconText}>?</T>  
                  </View>}
                showNavImage={true}>
                <T type="h3">About BarBud</T>
              </SectionItem>
              <SectionSeparator/>
              <SectionItem
                onPress={this.sendEmail.bind(this)}
                icon={
                  <View style={Styles.otherItemIcon}>
                    <NavigationImage 
                      type="mail"
                      color="black"
                      size={25}/>
                  </View>}>
                <T type="h3">Send Feedback</T>
              </SectionItem>
            </Section>
            <Section>
              <SectionItem
                onPress={this.confirmLogout.bind(this)}
                icon={
                  <View style={StyleSheet.flatten([Styles.otherItemIcon, {backgroundColor: 'red'}])}>
                    <NavigationImage 
                      type="x"
                      color="orange"
                      size={20}/>
                  </View>}>
                <T type="h3">Log Out</T>
              </SectionItem>
            </Section>
            {this.renderInternalSettings()}
          </ScrollView>
          <Modal
            ref={(r) => this.emailModal = r}
            visible={this.state.showEmailModal}
            dismissable={true}
            noHeader={true}
            onDismiss={() => this.setState({showEmailModal: false})}>
            <T type="h2" style={{textAlign: 'center'}}>Copy and paste the email below to send us feedback. We'd love to hear your thoughts!</T>
            <TextInputWithLabel
              borderColor="black"
              value={email}
              textInputProps={{autoFocus: true,
                               editable: true,
                               selectTextOnFocus: true}}/>
            <Button 
              containerStyle={{marginTop: -20}}
              text="OK"
              onPress={() => this.emailModal.dismiss()}/>
          </Modal>
        </View>
      );
    }
  }
}
