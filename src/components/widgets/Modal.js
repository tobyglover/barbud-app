import React, { Component } from 'react';
import { View,
  StyleSheet, 
  TouchableWithoutFeedback,
  Modal as NativeModal,
  Platform
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import T from './T';
import NavigationImage from './NavigationImage';
import WindowDimensions from '../../helpers/WindowDimensions'

const imageSize = 30;
const animationDuration = 100;
const headerStyle = {
  paddingHorizontal: 5,
  flex: 1,
  alignItems: 'center',
};

const Styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(100, 100, 100, .5)',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4
  },
  container: {
    borderRadius: 4,
    backgroundColor: 'white',
    padding: 10,
    width: WindowDimensions.width - 20
  },
  title: {
    textAlign: 'center'
  },
  scollableContainer: {
    width: WindowDimensions.width - 20
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dismissButton: {

  },
  headerTitle: {
    ...headerStyle,
    marginRight: imageSize,
  },
  headerTitleNoDismiss: {
    ...headerStyle,
    marginRight: 0
  },
  content: {
    paddingTop: 10,
  }
});

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dismissing: false,
      marginTopOnScrollableView: 0
    };
    this.lastLayoutHeight = 0;
  }

  componentWillUpdate(nextProps) {
    if (!nextProps.visible && this.props.visible) {
      this.dismiss();
    }
  }

  dismiss() {
    const dismissFunc = () => {
      if (this.props.animate) {
        this.setState({dismissing: true});
      } else {
        this.props.onDismiss && this.props.onDismiss();
      }
    }
    // This is a hack. On android, if the view is unrendered before this function returns, get error
    // "Got DOWN touch before receiving UP or CANCEL from last gesture". This fixes that by
    // returning before dismissing modal.
    Platform.select({
      android: () => setTimeout(dismissFunc.bind(this), 100),
      ios: dismissFunc
    })();
  }

  onRequestClose() {
    if (this.props.dismissable) {
      this.dismiss();
    }
  }

  dismissAnimationDone() {
    if (this.state.dismissing) {
      this.setState({dismissing: false});
      this.props.onDismiss && this.props.onDismiss();
    }
  }

  onScollableLayout(evt) {
    const layoutHeight = evt.nativeEvent.layout.height;
    if (layoutHeight != this.lastLayoutHeight) {
      this.setState({marginTopOnScrollableView: (WindowDimensions.height - layoutHeight) / 2});
      this.lastLayoutHeight = layoutHeight;
    }
  }

  render() {
    const dismissButton = this.props.dismissable && 
                            <NavigationImage 
                              style={Styles.dismissButton}
                              type="x"
                              color="orange"
                              onPress={this.dismiss.bind(this)}
                              clickable={true}
                              size={imageSize}/>;
    const header = this.props.noHeader ? null : 
      <View style={Styles.header}>
        {dismissButton}
        <View style={this.props.dismissable ? Styles.headerTitle : Styles.headerTitleNoDismiss}>
          <T type="h1" style={Styles.title}>{this.props.title}</T>
        </View>
      </View>

    let content = 
      <Animatable.View 
        animation={this.props.animate && (this.state.dismissing ? "fadeOutDown" : "fadeInUp")}
        duration={animationDuration}
        style={StyleSheet.flatten([Styles.container, this.props.scrollable && {width: '100%'}])}
        onAnimationEnd={this.dismissAnimationDone.bind(this)}>
        {header}
        <View style={Styles.content}>
          {this.props.children}
        </View>
      </Animatable.View>;

    if (this.props.scrollable) {
      content = 
          <KeyboardAwareScrollView style={Styles.scollableContainer}>
            <View onLayout={this.onScollableLayout.bind(this)} style={{marginTop: this.state.marginTopOnScrollableView}}>
            {content}
            </View>
          </KeyboardAwareScrollView>
    }
    content = <TouchableWithoutFeedback onPress={!this.props.scrollable ? this.onRequestClose.bind(this) : null}>
          <Animatable.View 
            animation={this.props.animate && (this.state.dismissing ? "fadeOut" : "fadeIn")}
            duration={animationDuration}
            style={Styles.background}>
            {content}
          </Animatable.View>
        </TouchableWithoutFeedback>;

    if (this.props.fake) {
      return content;
    }
    
    return (
      <NativeModal
        transparent={true}
        visible={this.props.visible || this.state.dismissing}
        onRequestClose={this.onRequestClose.bind(this)}>
        {content}
      </NativeModal>
    ); 
  }
}
