import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Modal, 
  Image
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import T from '../widgets/T';
import Button from '../widgets/Button';
import TextInputWithLabel from '../widgets/TextInputWithLabel';
import {FillBackgroundGray} from '../../statics/styles';
import {orange} from '../../statics/colors';
import Notifications from '../../helpers/Notifications';
import {raiseErrorMessage} from '../../helpers/Helpers';

const size = 200;
const Styles = StyleSheet.create({
  backgroundContainer: StyleSheet.flatten([FillBackgroundGray, {
    flex: 1,
    justifyContent: 'center'
  }]),
  contentContainer: {
    paddingTop: 50,
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 10,
    alignItems: 'center',
    flexDirection: 'column',
  },
  button: {},
  explainer: {
    textAlign: 'center',
    color: orange
  }
});

export default class BetaCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      addedToNotifications: false,
      hideNotification: true,
    };
    this.showedErrorMessage = false;
  }

  componentDidMount() {
    Notifications.hasNotificationPermission(prompted => {
      this.setState({hideNotification: prompted});
    })
  }

  onchange(code) {
    this.setState({code})
  }

  submit() {
    this.props.checkBetaCode(this.state.code);
  }

  subscribe() {
    Notifications.getNotificationPermissionIfNeededAndNotifyWhenPublic((succ) => {
      this.setState({addedToNotifications: succ, hideNotification: !succ});
    });
  }

  render() {
    if (this.props.apiStatus == 'error' && !this.showedErrorMessage) {
      raiseErrorMessage("Invalid beta code, try again" , () => {this.showedErrorMessage = true}, "Invalid");
    } else if (this.props.apiStatus == "loading") {
      this.showedErrorMessage = false;
    }
    return (
      <Modal
        animationType="fade"
        transparent={false}
        visible={this.props.show}
        onRequestClose={() => {}}>
        <View style={Styles.backgroundContainer}>
          <KeyboardAwareScrollView>
            <View style={Styles.contentContainer}>
              <View style={Styles.imageContainer}>
                <Image 
                  style={{width: size, height: size}}
                  source={require('../../statics/images/logo.png')}
                  resizeMode="contain"/>
              </View>
              <T type="h2" style={Styles.explainer}>BarBud is currently in beta. If you have a beta code, enter it below.</T>
              <View style={{width: '80%'}}>
                <TextInputWithLabel
                  label="Beta Code"
                  value={this.state.code}
                  onChangeText={this.onchange.bind(this)}
                  onSubmitEditing={this.submit.bind(this)}
                  textInputProps={{autoCapitalize:'none',
                                   returnKeyType:'done'}}/>
              </View>
              {!this.state.hideNotification ?
              <View style={Styles.buttonContainer}>
                <T type="h3" style={Styles.explainer}>Don't have a code? Get notified when we officially launch!</T>
                {this.state.addedToNotifications ? 
                  <T style={{color: 'white'}}>You'll get a notification soon</T> :
                  <Button
                    text="Notify Me"
                    onPress={this.subscribe.bind(this)}
                    type='CTAButtonWhite' />}
              </View> : null}
            </View>
          </KeyboardAwareScrollView>
        </View>
      </Modal>);
  }
}
