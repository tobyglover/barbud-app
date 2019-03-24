import React, { Component } from 'react';
import { 
  View,
  StyleSheet,
  ScrollView } from 'react-native';

import {Section, SectionItem, SectionSeparator} from './SettingsMenu'
import {Styles as SettingsUserStyles} from './SettingsUser';
import T from '../../widgets/T';
import {openURL} from '../../../helpers/Helpers'

import {FillBackgroundWhite} from '../../../statics/styles';

const Styles = StyleSheet.create({
  header: {
    marginBottom: 40,
  },
  licenseDesc: {
    margin: 10
  }
});

const licenses = [
  {
    title: "Icons8",
    url: "https://icons8.com"
  },
  {
    title: "React",
    url: "https://github.com/facebook/react/blob/master/LICENSE"
  },
  {
    title: "React Native",
    url: "https://github.com/facebook/react-native/blob/master/LICENSE"
  },
  {
    title: "React Native Animatable",
    url: "https://github.com/oblador/react-native-animatable/blob/master/LICENSE"
  },
  {
    title: "React Native Credit Card Input",
    url: "https://github.com/sbycrosz/react-native-credit-card-input/blob/master/LICENSE"
  },
  {
    title: "React Native Datepicker",
    url: "https://github.com/xgfe/react-native-datepicker/blob/master/LICENSE"
  },
  {
    title: "React Native Device Info",
    url: "https://github.com/rebeccahughes/react-native-device-info/blob/master/LICENSE"
  },
  {
    title: "React Native Keyboard Aware Scroll View",
    url: "https://github.com/APSL/react-native-keyboard-aware-scroll-view/blob/master/LICENSE"
  },
  {
    title: "React Native Permissions",
    url: "https://github.com/yonahforst/react-native-permissions/blob/master/LICENSE"
  },
  {
    title: "React Navigation",
    url: "https://github.com/react-navigation/react-navigation/blob/master/LICENSE"
  },
  {
    title: "React Redux",
    url: "https://github.com/reactjs/react-redux/blob/master/LICENSE.md"
  },
  {
    title: "Redux",
    url: "https://github.com/reactjs/redux/blob/master/LICENSE.md"
  },
  {
    title: "Redux Persist",
    url: "https://github.com/rt2zz/redux-persist/blob/master/LICENSE"
  },
  {
    title: "Redux Persist Transform Filter",
    url: "https://github.com/edy/redux-persist-transform-filter/blob/master/LICENSE"
  },
  {
    title: "React Native Splash Screen",
    url: "https://github.com/crazycodeboy/react-native-splash-screen/blob/master/LICENSE"
  },
  {
    title: "Redux Thunk",
    url: "https://github.com/gaearon/redux-thunk/blob/master/LICENSE.md"
  },
  {
    title: "Roboto",
    url: "https://github.com/google/roboto/blob/master/LICENSE"
  }

];

export default class SettingsLegal extends Component {
  componentWillMount() {
    this.props.screenProps.registerGoBackCaller(this.props.navigation.goBack);
  }

  renderLicenseLinks() {
    return licenses.map(value => 
      <View key={value.title}>
        <SectionItem
          onPress={() => openURL(value.url)}
          showNavImage={true}>
          <T type="h3">{value.title}</T>
        </SectionItem>
        <SectionSeparator/>
      </View>
    );
  }

  render() {
    return (
      <View style={FillBackgroundWhite}>
        <T type="h1" style={StyleSheet.flatten([Styles.header, SettingsUserStyles.header])}>Legal</T>
        <ScrollView>
          <Section>
            <SectionItem
              onPress={() => this.props.navigation.navigate("Disclaimer")}
              showNavImage={true}>
              <T type="h3">Terms and Conditions</T>
            </SectionItem>
            <SectionSeparator/>
            <SectionItem
              onPress={() => openURL('https://www.getbarbud.com/privacy-policy')}
              showNavImage={true}>
              <T type="h3">Privacy Policy</T>
            </SectionItem>
          </Section>
          <T style={Styles.licenseDesc}>BarBud uses open-source software and packages to bring you a better experience</T>
          <Section>
            {this.renderLicenseLinks()}
          </Section>
        </ScrollView>
      </View>
    );
  }
}
