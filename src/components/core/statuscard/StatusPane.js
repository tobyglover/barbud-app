import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  StatusBar,
  Image,
  RefreshControl,
  Platform,
  BackHandler
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ifIphoneX } from 'react-native-iphone-x-helper'

import NavigationImage from '../../widgets/NavigationImage';
import T from '../../widgets/T';
import Badge from '../../widgets/Badge';
import {safeAreaOffset} from '../../widgets/SafeAreaView';
import Notifications from '../../../helpers/Notifications';
import WindowDimensions from '../../../helpers/WindowDimensions';

import PendingOrderContainer from '../../../containers/core/statuscard/PendingOrderContainer';
import CompletedOrdersContainer from '../../../containers/core/statuscard/CompletedOrdersContainer';
import CurrentOrdersContainer from '../../../containers/core/statuscard/CurrentOrdersContainer';
import MakingOrdersContainer from '../../../containers/core/statuscard/MakingOrdersContainer';
import HistoryOrdersContainer from '../../../containers/core/statuscard/HistoryOrdersContainer';

const WINDOW_HEIGHT = WindowDimensions.height;
const STATUS_BAR_HEIGHT = 80;
const STATUS_BAR_BORDER_RADIUS = 10;
const BOTTOM_STATUS_BAR_OFFSET = ifIphoneX(10, 0);
const TOP_STATUS_BAR_OFFSET = ifIphoneX(safeAreaOffset, 0);
const SWIPE_THRESHOLD = 3;
const BOUCINESS = 5;
const ARROW_SIZE = 30;
const MOVE_FILTER = 10;
const BACKGROUND_COLOR = 'black';
const REFRESH_INTERVAL = 60000;

export const TotalHeight = STATUS_BAR_HEIGHT + BOTTOM_STATUS_BAR_OFFSET;

const Styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    left: 0,
    top: WINDOW_HEIGHT - STATUS_BAR_HEIGHT,
    height: WINDOW_HEIGHT + STATUS_BAR_HEIGHT,
    zIndex: 2,
    backgroundColor: BACKGROUND_COLOR
  },
  statusBar: {
    borderTopLeftRadius: STATUS_BAR_BORDER_RADIUS,
    borderTopRightRadius: STATUS_BAR_BORDER_RADIUS,
    width: '100%',
    height: STATUS_BAR_HEIGHT,
    backgroundColor: BACKGROUND_COLOR,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  arrowContainer: {
    height: ARROW_SIZE,
    width: ARROW_SIZE,
    margin: 15,
  },
  statusBarTitle: {
    color: 'white',
    flex: 1,
    marginLeft: 10
  },
  orderHistoryTitle: {
    marginTop: 10,
    marginHorizontal: 25,
    borderTopWidth: 2,
    borderColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 0
  },
  ticketContainer: {
    marginHorizontal: 10,
  },
  badge: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2
  },
  ticketIcon: {
    marginTop: 10,
    marginLeft: 10,
    width: 35,
    height: 35,
  },
  contentContainer: {
    width: '100%',
    height: WINDOW_HEIGHT - STATUS_BAR_HEIGHT - TOP_STATUS_BAR_OFFSET,
    backgroundColor: BACKGROUND_COLOR
  },
  scrollViewContent: {
    paddingBottom: ifIphoneX(safeAreaOffset, 20)
  },
  iPhoneXPadding: {
    width: '100%',
    backgroundColor: BACKGROUND_COLOR
  }
});

export default class StatusPane extends Component {
  constructor(props) {
    super(props);
    // isOpen is only used to hide the status bar while the card is fully open and to determine
    // back button behavior on android
    this.state = {
      isOpen: false,
      isHidden: false
    };
  }

  componentWillMount() {
    this.refreshAndSetIntervalIfNoNotifications();
    this.animatedValue = new Animated.ValueXY();
    this.value = {x: 0, y: 0};
    this.previousSwipeDirection = "";

    this.animatedValue.addListener(value => {
      this.value = value;
    });
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {
        this.previousSwipeDirection = this.state.isOpen ? 'down' : 'up';
        this.animatedValue.setOffset({x: this.value.x, y: this.value.y});
        this.animatedValue.setValue({x: 0, y: 0});
      },
      onPanResponderMove: (evt, {dx, dy, vy}) => {
        this.animatedValue.x.setValue(dx);
        this.animatedValue.y.setValue(dy);
        // Need move filter because taps can move slightly, causing the user to think the
        // tap didn't register
        if (dy > MOVE_FILTER) {
          //negative vy is moving up, positive down. Storing here so that if the 
          // user pauses and then releases we can base the open/close behavior
          this.previousSwipeDirection = vy > 0 ? 'down' : 'up';
        }
      },
      onPanResponderRelease: (evt, {vy}) => {
        this.animatedValue.flattenOffset();
        const speed = vy > SWIPE_THRESHOLD ? vy : 15
        if (this.previousSwipeDirection == 'up') {
          this.open(speed);
        } else {
          this.close(speed);
        }
      }
    });
  }

  componentDidMount() {
    if (this.props.shouldHide) {
      this.hide();
    }
  }

  componentWillUnmount() {
    this.cancelRefreshInterval();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.shouldHide && !this.props.shouldHide) {
      this.hide();
    } else if (!nextProps.shouldHide && this.props.shouldHide) {
      this.close();
    }
  }

  backPressed() {
    if (this.state.isOpen) {
      this.close();
      return true;
    }
    return false;
  }

  close(speed) {
    BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    this.setState({isOpen: false});
    this.props.onStatusChange('close');
    this.spring(speed || 15, {x: 0, y: -BOTTOM_STATUS_BAR_OFFSET});
    this.scrollView && this.scrollView.props.scrollToPosition(0, 0, false);
  }

  open(speed) {
    BackHandler.addEventListener('hardwareBackPress', this.backPressed.bind(this));
    this.setState({isOpen: true});
    this.props.onStatusChange('open');
    this.spring(speed || 15, {x: 0, y: STATUS_BAR_HEIGHT - WINDOW_HEIGHT});
  }

  hide(speed) {
    this.props.onStatusChange('hidden');
    this.spring(speed || 15, {x: 0, y: TotalHeight});
  }

  spring(speed, toValue) {
    Animated.spring(this.animatedValue, {
      toValue,
      speed,
      bounciness: BOUCINESS
    }).start();
  }

  statusBarTapped() {
    if (this.state.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  cancelRefreshInterval() {
    clearInterval(this.refreshInterval);
  }

  refreshAndSetIntervalIfNoNotifications() {
    if (this.props.apiStatus != 'loading') {
      // Only do if not already loading
      this.props.getUserOrderStatuses();
    }
    Notifications.hasNotificationPermission(() => {
      // No Notifications
      if (!this.refreshInterval) {
        this.refreshInterval = setInterval(this.refreshAndSetIntervalIfNoNotifications.bind(this), REFRESH_INTERVAL);
      }
    }, this.cancelRefreshInterval.bind(this))
  }

  render() {
    const top = STATUS_BAR_HEIGHT - WINDOW_HEIGHT;
    const bottom = -BOTTOM_STATUS_BAR_OFFSET
    const rotateAnimation = this.animatedValue.y.interpolate({
      inputRange: [top, bottom],
      outputRange: ['270deg', '90deg'],
      extrapolate: 'clamp'
    });
    const bottomIPhoneXPaddingAnimation = this.animatedValue.y.interpolate({
      inputRange: [top, bottom],
      outputRange: [0, BOTTOM_STATUS_BAR_OFFSET],
      extrapolate: 'clamp'
    });
    const topIPhoneXPaddingAnimation = this.animatedValue.y.interpolate({
      inputRange: [top, bottom / 2],
      outputRange: [TOP_STATUS_BAR_OFFSET, 0],
      extrapolate: 'clamp'
    });
    
    const ticketContainer = this.props.pendingOrderQuantity > 0 ? (
        <Animatable.View
          animation={"fadeIn"}
          duration={250}
          style={Styles.ticketContainer}>
          <Badge 
            style={Styles.badge}
            number={this.props.pendingOrderQuantity}/>
          <Image 
            style={Styles.ticketIcon}
            source={require('../../../statics/images/ticket_icon.png')}
            resizeMode="contain"/>
        </Animatable.View>
      ) : null;

    let title = "";
    if (this.props.pendingOrderQuantity > 0) {
      title = "Finish Order";
    } else if (this.props.completedOrdersQuantity > 0) {
      title = "Order" + (this.props.completedOrdersQuantity > 1 ? "s" : "") + " ready for pickup";
    } else if ( this.props.makingOrdersQuantity > 0) {
      title = "Order" + (this.props.makingOrdersQuantity > 1 ? "s" : "") + " in progress";
    } else if (this.props.currentOrdersQuantity > 0) {
      title = "Queued Order" + (this.props.currentOrdersQuantity > 1 ? "s" : "");
    } else if (this.props.orderHistoryQuantity > 0) {
      title = "Order History";
    }

    return (
        <Animated.View 
          style={[Styles.container, {transform: [{translateY: this.animatedValue.y}, { perspective: 1000 }]}]}>
          <StatusBar
            animated={true}
            hidden={Platform.select({ios: ifIphoneX(false, this.state.isOpen), android: false})}
            backgroundColor='black'/>
          <View>
            <Animated.View style={[Styles.iPhoneXPadding, {height: topIPhoneXPaddingAnimation}]}/>
            <View style={Styles.statusBar} {...this.panResponder.panHandlers}>
              <Animated.View style={[Styles.arrowContainer, {transform: [{rotate: rotateAnimation}]}]}>
                <NavigationImage
                  clickable={false}
                  type="arrow"
                  color="white"
                  size={ARROW_SIZE}/>
              </Animated.View>
              <T type="h1" style={Styles.statusBarTitle}>{title}</T>
              {ticketContainer}
            </View>
            <Animated.View style={[Styles.iPhoneXPadding, {height: bottomIPhoneXPaddingAnimation}]}/>
          </View>
          <View style={Styles.contentContainer}>
            <KeyboardAwareScrollView
              innerRef={(r) => this.scrollView = r}
              extraHeight={200}
              contentContainerStyle={Styles.scrollViewContent}
              refreshControl={
                <RefreshControl 
                  refreshing={this.props.apiStatus == 'loading'}
                  onRefresh={this.props.getUserOrderStatuses}/>}>
              <PendingOrderContainer />
              <CompletedOrdersContainer />
              <MakingOrdersContainer />
              <CurrentOrdersContainer />
              {title != "Order History" && this.props.orderHistoryQuantity > 0 && 
                <View style={Styles.orderHistoryTitle}> 
                  <T type="h1" style={StyleSheet.flatten([Styles.statusBarTitle, ])}>Order History</T>
                </View>}
              <HistoryOrdersContainer />
            </KeyboardAwareScrollView>
          </View>
        </Animated.View>
    );
  }
}
