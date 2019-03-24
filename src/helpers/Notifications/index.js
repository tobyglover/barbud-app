/*
  Follows a singleton patterns in regards to holding the Redux store

  For documentation, since it isn't anywhere in their's
  OneSignal Status Object:
  { 
    hasPrompted: [boolean]
    notificationsEnabled: [boolean]
    pushToken: [string]
    subscriptionEnabled: [boolean]
    userId: [string] (also called player ID in some places on OneSignal)
    userSubscriptionEnabled: [boolean]
  }
  OneSignal Notification Object:
  {
      isAppInFocus: true
      payload: {
        additionalData: {key: "value"}
        body: "message body"
        notificationID: "073bd228-f057-4330-8d2f-6758f305e5c7"
        sound: "default"
      }
      shown: false
    }
    (openResult.notification is the same as above.)
  - If app is in foreground: onReceived is called, not onOpened
  - If app is in background but in memory: onReceived (sometimes) and onOpened called.
  - If app is completely closed: only onOpened is called, not onReceived
*/

import {Platform, Alert} from 'react-native';
import OneSignal from 'react-native-onesignal';
import Permissions from 'react-native-permissions';

import OrderStatusChange from './parsers/OrderStatusChange';

OneSignal.inFocusDisplaying(0);

let store = null;

const NotificationParsers = {
  "ORDER_STATUS_CHANGE": OrderStatusChange
};

const actOnNotification = (notification) => {
  const type = notification.payload.additionalData.type
  type && NotificationParsers[type] && NotificationParsers[type].parse(store, notification);
};

const setStore = s => store = s;

const onReceived = (notification) => {
  if (notification.isAppInFocus) {
    actOnNotification(notification)
  }
};

const onOpened = (openResult) => {
  actOnNotification(openResult.notification);
};

const registerListeners = () => {
  OneSignal.addEventListener('received', onReceived);
  OneSignal.addEventListener('opened', onOpened);
  OneSignal.addEventListener('registered', registerDeviceToUser);
};

const unregisterListeners = () => {
  OneSignal.removeEventListener('received', onReceived);
  OneSignal.removeEventListener('opened', onOpened);
  OneSignal.removeEventListener('registered', registerDeviceToUser);
};

const registerDeviceToUser = () => {
  const email = store.getState().App.user.email;
  OneSignal.sendTag("email", email);
};

const notifyWhenPublic = () => {
  OneSignal.sendTag("notifyWhenPublic", "true");
};

const unregisterDeviceToUser = () => {
  OneSignal.deleteTag("email");
};

const hasNotificationPermission = (onIsNotPermitted, onIsPermitted) => {
  if (Platform.OS === 'ios') {
    checkNotificationStatus(status => {
      if (status.notificationsEnabled) {
        onIsPermitted && onIsPermitted();
      } else {
        onIsNotPermitted(status.hasPrompted);
      }
    });
  } else {
    // Allowed by default on Android
    onIsPermitted && onIsPermitted();
  }
};

const getNotificationPermissionIfNeeded = (alertMessage, onComplete) => {
  const register = () => {
   OneSignal.promptForPushNotificationsWithUserResponse(succ => {
      onComplete(succ);
    });
  };
  hasNotificationPermission(hasPrompted => {
    if (alertMessage) {
      Alert.alert(
      'Notifications',
        alertMessage,
        hasPrompted ?
          [{text: 'Deny', style: 'cancel'}, {text: 'Open Settings', onPress: Permissions.openSettings}] :
          [{text: 'Ok', onPress: register}]
      );
    } else {
      register();
    }
  }, onComplete)
}

const getNotificationPermissionIfNeededAndRegister = () => {
  getNotificationPermissionIfNeeded('BarBud can send you a notification when your drink is ready, so you can get it as soon as possible', registerDeviceToUser);
};

const getNotificationPermissionIfNeededAndNotifyWhenPublic = (onComplete) => {
  getNotificationPermissionIfNeeded('', (succ) => {
    succ && notifyWhenPublic();
    onComplete(succ);
  });
}

const registerDeviceToUserIfHasNotificationPermission = () => {
  hasNotificationPermission(() => {}, registerDeviceToUser);
};

const checkNotificationStatus = (callback) => {
  OneSignal.getPermissionSubscriptionState(status => {
    typeof callback == 'function' && callback(status);
  });
}

module.exports = {
  setStore,
  registerListeners,
  unregisterListeners,
  registerDeviceToUser,
  unregisterDeviceToUser,
  checkNotificationStatus,
  hasNotificationPermission,
  getNotificationPermissionIfNeededAndRegister,
  getNotificationPermissionIfNeededAndNotifyWhenPublic,
  registerDeviceToUserIfHasNotificationPermission,
}
