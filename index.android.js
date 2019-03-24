/* eslint no-console: 0 */

import React, { Component } from 'react';
import {AppRegistry, Platform} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {Crashlytics} from 'react-native-fabric';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist'
import {setJSExceptionHandler} from 'react-native-exception-handler';

import Reducers from './src/reducers';
import Logging from './src/middleware/Logging';
import Notifications from './src/helpers/Notifications'

import AppContainer from './src/containers/AppContainer'

console.disableYellowBox = true;
let middleware = [thunk];
if (__DEV__) {
  middleware.push(Logging);
} else {
  setJSExceptionHandler(error => {
    Platform.select({
      android: () => Crashlytics.logException(error),
      ios: () => Crashlytics.recordError(error)
    })();
  });
}

const store = createStore(Reducers, {}, applyMiddleware(...middleware));

export default class Index extends Component {
  componentWillMount() {
    persistStore(store, null, () => setTimeout(SplashScreen.hide, 2000));
    Notifications.setStore(store);
    Notifications.registerListeners();
  }

  componentWillUnmount() {
    Notifications.unregisterListeners();
  }

  render() {
    return (
    <Provider store={store}>
      <AppContainer />
    </Provider>);
  }
}

AppRegistry.registerComponent('BarBud', () => Index);
