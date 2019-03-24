import React, { Component } from 'react';
import {
  View,
  SectionList,
  RefreshControl,
  TouchableHighlight,
  StyleSheet,
  Image } from 'react-native';
import FastImage from 'react-native-fast-image'

import T from '../widgets/T';
import {width} from '../../helpers/WindowDimensions';
import ConfirmationModal from '../widgets/ConfirmationModal';
import Button from '../widgets/Button';
import Locations from '../../helpers/Locations';
import {metersToMiles} from '../../helpers/Helpers';
import {FillBackgroundLightGray} from '../../statics/styles';

const size = 50;
const SECTION_ORDER = ["active", "onboarding"];
const SECTION_HEADERS = ["", "Coming Soon"];

const Styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: 'white'
  },
  itemContainer: {
    marginTop: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'black',
  },
  itemOnboardingContainer: {
    opacity: 0.8,
  },
  itemTouchableContainer: {
    backgroundColor: 'white'
  },
  itemImage: {
    width,
    height: width * 9 / 16
  },
  itemTextContainer: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 15,
  },
  emptyListContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  refreshButton: {
    fontSize: 24,
    color: 'gray',
    marginVertical: 25,
    textAlign: 'center'
  },
  listFooterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
    paddingVertical: 15,
  },
  listFooterText: {
    paddingRight: 5
  },
  sectionHeader: {
    paddingLeft: 5,
    paddingVertical: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'black',
    backgroundColor: 'white'
  }
});

export default class VenueSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      containerHeight: 0,
      showListEmptyComponent: false,
      modal: {
        show: false,
        barName: '',
        onPressFunc: () => {}
      }
    };
  }

  componentWillMount() {
    Locations.getPermissionIfNecessary(this.props.onListRefresh, this.props.onListRefresh);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.searchApiStatus == "success" && !this.state.showListEmptyComponent) {
      this.setState({showListEmptyComponent: true});
    }
    if (nextProps.barList != this.props.barList) {
      this.promptUsertoAutoEnterBar(nextProps.barList);
    }
  }

  promptUsertoAutoEnterBar(barList) {
    for (let i = 0; i < barList.length; i++) {
      const item = barList[i];
      if (item.metersFromUser <= item.radiusInMeters && item.status == "active") {
        this.setState({
          modal: {
            show: true,
            barName: item.name,
            onPressFunc: () => this.onListItemSelected(item),
          }
        });
        return;
      }
    }
  }

  onListItemSelected(item) {
    this.props.onListItemSelected(item);
    this.props.navigation.navigate("Venue");
  }

  renderItem(item) {
    let dist = metersToMiles(item.item.metersFromUser);
    if (dist > 10) {
      dist = Math.round(dist);
    } else {
      dist = dist.toFixed(2);
    }

    return (
      <View style={StyleSheet.flatten([Styles.itemContainer, item.item.status == "onboarding" && Styles.itemOnboardingContainer])}>
        <TouchableHighlight
          onPress={item.item.status == "active" ? () => this.onListItemSelected(item.item) : undefined}
          underlayColor='lightgray'>
          <View style={Styles.itemTouchableContainer}>
            {item.item.logoUrl &&
            <FastImage
              style={Styles.itemImage}
              source={{
                uri: item.item.logoUrl,
                priority: FastImage.priority.high}}
              resizeMode={FastImage.resizeMode.cover}/>}
            <View style={Styles.itemTextContainer}>
              <T type="h2">{item.item.name}</T>
              <T type="h3">{typeof item.item.metersFromUser == "number" ? dist + " miles away" : ''}</T>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  renderSectionHeader(section) {
    let {header} = section.section;
    if (header) {
      return <View style={Styles.sectionHeader}><T type="h1">{header}</T></View>
    }
  }

  renderSectionFooter(section) {
    let {index} = section.section;
    if (index < SECTION_ORDER.length - 1) {
      return <View style={{height: 20, backgroundColor: 'white'}}/>
    }
  }

  renderListEmptyComponent() {
    if (this.state.showListEmptyComponent && this.props.searchApiStatus != 'error') {
      return (
        <View style={StyleSheet.flatten([Styles.emptyListContainer, {height: this.state.containerHeight}])}>
          <T type="h2">No bars in your area yet</T>
          <T type="h3">(We know, we're sad too)</T>
          <Button
            type="text"
            text="Try Again"
            onPress={this.props.onListRefresh}
            textProps={{style: Styles.refreshButton}}/>
        </View>
      );
    } else {
      return null;
    }
  }

  renderListFooterComponent() {
    return (
      <View style={Styles.listFooterContainer}>
        <Image
          style={{width: size, height: size}}
          source={require('../../statics/images/barbud_phonehand.png')}
          resizeMode="contain"/>
        <T style={Styles.listFooterText}>More Locations Coming Soon!</T>
        <Image
          style={{width: size, height: size}}
          source={require('../../statics/images/barbud_beerhand.png')}
          resizeMode="contain"/>
      </View>
    );
  }

  renderErrorComponent() {
    if (this.props.searchApiStatus == "error") {
      return (
        <View style={StyleSheet.flatten([Styles.emptyListContainer, {height: this.state.containerHeight}])}>
          <Button
            type="text"
            text="Error loading venue list, tap to retry"
            onPress={this.props.onListRefresh}
            textProps={{style: Styles.refreshButton}}/>
        </View>
      );
    } else {
      return null;
    }
  }

  keyExtractor(item) {
    return item.uuid;
  }

  onContainerLayout(evt) {
    this.setState({containerHeight: evt.nativeEvent.layout.height});
  }

  userRespondedToConfirmationModal(val) {
    this.confirmationModal.dismiss();
    if (val) {
      this.state.modal.onPressFunc();
    }
  }

  onDismissModal() {
    this.setState({modal: {...this.state.modal, show: false}});
  }

  createSections() {
   let sections = [];

   this.props.barList.forEach(val => {
     let index = SECTION_ORDER.indexOf(val.status);
     if (index < 0) {
       return;
     }

     if (!sections[index]) {
       sections[index] = {
         data: [],
         header: SECTION_HEADERS[index],
         index
       };
     }

     sections[index].data.push(val);
   });

   return sections;
  }

  renderAutoEnterBarModal() {
    return (
      <ConfirmationModal
        visible={this.state.modal.show}
        dismissable={true}
        ref={(r) => this.confirmationModal = r}
        title={`Already in ${this.state.modal.barName}?`}
        animate={true}
        onDismiss={this.onDismissModal.bind(this)}
        cancelButtonText="Return to Search"
        confirmButtonText="View Menu"
        isCancelButtonSmall={true}
        onResponse={this.userRespondedToConfirmationModal.bind(this)}/>
    );
  }

  render() {
    const refreshControl =
      <RefreshControl
        refreshing={this.props.searchApiStatus == 'loading'}
        onRefresh={this.props.onListRefresh}/>
    return (
      <View
        style={FillBackgroundLightGray}
        onLayout={this.onContainerLayout.bind(this)}>
        <SectionList
          sections={this.createSections()}
          renderItem={this.renderItem.bind(this)}
          renderSectionHeader={this.renderSectionHeader.bind(this)}
          renderSectionFooter={this.renderSectionFooter}
          keyExtractor={this.keyExtractor}
          refreshControl={refreshControl}
          ListEmptyComponent={this.renderListEmptyComponent.bind(this)}
          ListFooterComponent={this.renderListFooterComponent.bind(this)}/>
        {this.renderErrorComponent()}
        {this.renderAutoEnterBarModal()}
      </View>
    );
  }
}
