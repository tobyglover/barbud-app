import React, { Component } from 'react';
import { 
  View,
  StyleSheet,
  Image,
  ScrollView} from 'react-native';

import {Section, SectionItem} from './SettingsMenu'
import T from '../../widgets/T';
import WindowDimensions from '../../../helpers/WindowDimensions';

import {FillBackgroundWhite} from '../../../statics/styles';

const Styles = StyleSheet.create({
  header: {
    alignItems: 'center'
  },
  headerImage: {
    height: 200, 
    width: WindowDimensions.width * .7
  },
  menuContainer: {
    marginTop: 20
  },
  p: {
    margin: 10
  }
});

export default class SettingsAbout extends Component {
  componentWillMount() {
    this.props.screenProps.registerGoBackCaller(this.props.navigation.goBack);
  }

  render() {
    return (
      <View style={FillBackgroundWhite}>
        <ScrollView>
          <View style={Styles.header}>
            <Image 
              style={Styles.headerImage}
              source={require('../../../statics/images/logonotype.png')}
              resizeMode="contain"/>
            <T type="h2" style={Styles.p}>BarBud is a growing startup based in Minneapolis, MN. Founders Will and Jack have set out to bring the bar experience up to speed with today’s technology.</T>
            <T type="h2" style={Styles.p}>The BarBud app helps bartenders get drinks out faster through the use of digital tickets. By removing the bartender from the ordering process, they can focus solely on pumping out your orders. Get access to the bar’s menu and place your drink order while paying from your phone - all without having to fight your way to the bartender. When your drink is ready, you will get a notification to show the bartender - grab your drink and get back to your friends.</T>
          </View>
          <View style={Styles.menuContainer}>
            <Section>
              <SectionItem
                onPress={() => this.props.navigation.navigate("Legal")}
                showNavImage={true}>
                <T type="h3">Legal</T>
              </SectionItem>
            </Section>
          </View>
        </ScrollView>
      </View>
    );
  }
}
