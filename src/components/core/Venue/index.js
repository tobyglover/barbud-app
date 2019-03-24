import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
  BackHandler
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import T from '../../widgets/T';
import ConfirmationModal from '../../widgets/ConfirmationModal';
import NavigationImage from '../../widgets/NavigationImage';
import {darkOrange} from '../../../statics/colors';

import Menu from './Menu';
import NextHoursEvent from './NextHoursEvent';

const BAR_SELECTOR_ARROW_SIZE = 25;
const ANIMATION_DURATION = 250;
const barSelectorBase = {
  position: 'absolute',
  width: '100%',
  backgroundColor: darkOrange,
}

const Styles = StyleSheet.create({
  venueContainer: {
    height: '100%',
    backgroundColor: 'white'
  },
  statusContainer: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  barSelectorButtonContainer: {
    zIndex: 4,
    backgroundColor: darkOrange,
    paddingVertical: 10,
    alignItems: 'center',
    paddingHorizontal: 5
  },
  barSelectorAnimationContainer: {
    zIndex: 3,
    position: 'absolute',
    backgroundColor: darkOrange,
    width: '100%',
  },
  barSelectorToggle: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  arrowContainer: {
    height: BAR_SELECTOR_ARROW_SIZE,
    width: BAR_SELECTOR_ARROW_SIZE,
  },
  barNameContainer: {
    marginRight: BAR_SELECTOR_ARROW_SIZE,
    paddingHorizontal: 5,
    flex: 1
  },
  barName: {
    color: 'white',
    textAlign: 'center',
  },
  viewPagerContainer: {
    flex: 1,
    zIndex: 1
  },
  barSelectorOpen: {
    ...barSelectorBase,
    marginTop: 0,
  },
  selectorOpenBackgroundContainer: {
    zIndex: 2,
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    height: '100%',

  },
  selectorOpenBackground: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(100, 100, 100, .5)',
  },
  barNameSelector: {
    color: 'white',
    fontSize: 24,
    paddingRight: 10,
    flex: 1
  },
  barSelectorButton: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
});

export default class Venue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      barSelectorHeight: 0,
      barSelectorOpen: false,
      isBarOpen: true
    };
  }

  componentWillMount() {
    this.props.screenProps.registerVenueComponent(this);
    this.animatedValue = new Animated.Value();
    this.animatedValue.setValue(100);
    this.rotationInterpolator = this.animatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: ['270deg', '90deg'],
      extrapolate: 'clamp'
    });
    this.preselectBarIfOnlyOne();
    this.onDismissModal();
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backPressedAndroid.bind(this));
  }

  componentDidReceiveProps() {
    this.preselectBarIfOnlyOne();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backPressedAndroid);
  }

  backPressedAndroid() {
    this.requestGoBack();
    return true;
  }

  goBack() {
    this.props.navigation.goBack();
  }

  requestGoBack() {
    this.promptBeforeChange(this.goBack.bind(this));
  }

  promptBeforeChange(onChange) {
    if (Object.keys(this.props.order).length > 0) {
      this.setState({modal: {show: true, onChange}})
    } else {
      onChange();
    }
  }

  onDismissModal() {
    this.setState({modal: {show: false}});
  }

  preselectBarIfOnlyOne() {
    if (this.onlyOneBar()) {
      this.selectBar(0);
    } else {
      this.selectBar(-1);
      this.toggleBarSelector();
    }
  }

  selectBar(index) {
    if (index != -1) {
      this.toggleBarSelector();
      if (this.props.barIndex != index) {
        this.promptBeforeChange(() => {
          // get menu after animation is done to avoid animation lag on draw of menu
          setTimeout(() => this.props.barSelected(index), ANIMATION_DURATION);
        })
      }
    } else {
      this.props.barSelected(index);
    }
  }

  onlyOneBar() {
    return this.props.venue.bars.length == 1;
  }

  toggleBarSelector() {
    let toValue = 0;
    if (this.state.barSelectorOpen) {
      toValue = 100;
    }
    this.setState({barSelectorOpen: !this.state.barSelectorOpen});
    Animated.timing(this.animatedValue, {
      toValue,
      duration: ANIMATION_DURATION,
    }).start();
  }

  cancel() {
    if (this.props.bar && this.state.barSelectorOpen) {
      this.toggleBarSelector();
    }
  }

  renderBarButton(value, index) {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.selectBar(index)}
        underlayColor={'gray'}>
        <View style={Styles.barSelectorButton}>
          <T type="h3" style={Styles.barNameSelector}>{value.name}</T>
          {this.props.barIndex == index &&
            <NavigationImage
              clickable={false}
              type="checkmark"
              color="white"
              size={BAR_SELECTOR_ARROW_SIZE}/>}
        </View>
      </TouchableOpacity>
    );
  }

  onBarSelectorLayout(evt) {
    this.setState({barSelectorHeight: evt.nativeEvent.layout.height})
  }

  renderBarSelector() {
    const animationView =
      <Animatable.View
        duration={ANIMATION_DURATION - 25}
        animation={this.state.barSelectorOpen ? 'fadeInDown' : 'fadeOutUp'}
        style={Styles.barSelectorAnimationContainer}>
        <View onLayout={this.onBarSelectorLayout.bind(this)}>
          {this.props.venue.bars.map(this.renderBarButton.bind(this))}
        </View>
      </Animatable.View>

    return Platform.select({
      android: <View>{animationView}</View>,
      ios: <View style={{zIndex: 3}}>{animationView}</View>
    })
  }

  renderBarSelectorBackground() {
    if (this.state.barSelectorOpen) {
      return (
        <View style={Styles.selectorOpenBackgroundContainer}>
          <TouchableWithoutFeedback
            onPress={this.cancel.bind(this)}>
            <Animatable.View
              duration={ANIMATION_DURATION}
              animation='fadeIn'
              style={Styles.selectorOpenBackground}/>
          </TouchableWithoutFeedback>
        </View>
      );
    } else {
      return null;
    }
  }

  userRespondedToConfirmationModal(val) {
    this.confirmationModal.dismiss();
    if (val) {
      this.state.modal.onChange();
    }
  }

  renderConfirmationModal() {
    const selectedBar = this.props.bar;
    let barName = this.props.venue.name;
    if (!this.onlyOneBar() && selectedBar) {
      barName = barName + " - " + selectedBar.name;
    }
    return (
      <ConfirmationModal
        visible={this.state.modal.show}
        ref={(r) => this.confirmationModal = r}
        title={`Leave ${barName}?`}
        animate={true}
        onDismiss={this.onDismissModal.bind(this)}
        cancelButtonText="Stay"
        confirmButtonText="Leave"
        onResponse={this.userRespondedToConfirmationModal.bind(this)}
        message={`Leaving will destroy your pending order at ${barName}.`}/>
    );
  }

  onRefresh() {
    this.props.getDrinksForBar(this.props.bar.uuid);
  }

  isBarOpen(status) {
    this.setState({isBarOpen: status});
  }

  render() {
    if (!this.props.show) {
      return null;
    }
    const menu =
      <Menu
        onRefresh={this.onRefresh.bind(this)}
        apiStatus={this.props.apiStatus}
        bar={this.props.bar}
        order={this.props.order}
        menu={this.props.menu}
        onDrinkItemPressed={this.state.isBarOpen && this.props.onDrinkItemPressed}/>

    if (this.onlyOneBar()) {
      return (
        <View style={Styles.venueContainer}>
          {menu}
          {this.renderConfirmationModal()}
        </View>
      );
    } else {
      return (
        <View style={Styles.venueContainer}>
          <View style={Styles.barSelectorButtonContainer}>
            <TouchableWithoutFeedback
              onPress={this.state.barSelectorOpen ? this.cancel.bind(this) : this.toggleBarSelector.bind(this)}>
              <View style={Styles.barSelectorToggle}>
                <Animated.View style={[Styles.arrowContainer, {transform: [{rotate: this.rotationInterpolator}]}]}>
                  <NavigationImage
                    clickable={false}
                    type="arrow"
                    color="white"
                    size={BAR_SELECTOR_ARROW_SIZE}/>
                </Animated.View>
                <View style={Styles.barNameContainer}>
                  <T type="h2" style={Styles.barName}>
                    {this.state.barSelectorOpen ? `Select a Bar Within ${this.props.venue.name}` : this.props.bar.name}
                  </T>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
          {this.renderBarSelector()}
          <NextHoursEvent
            hours={this.props.venue.hours}
            timeZone={this.props.venue.timeZone}
            isBarOpen={this.isBarOpen.bind(this)}/>
          {menu}
          {this.renderBarSelectorBackground()}
          {this.renderConfirmationModal()}
        </View>
      );
    }
  }
}
