import {
  Platform, 
  Alert, 
  PermissionsAndroid} from 'react-native';
import Permissions from 'react-native-permissions';

const androidLocationPermission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
const permissionMessageTitle = 'Location Access';
const permissionMessageContent = 'BarBud can use your location to find you the closest bars';

const getPermissionStatus = (callback) => {
  Platform.select({
    ios: () => {
      Permissions.check('location').then(response => callback(response == 'authorized', response))
    },
    android: () => {
      PermissionsAndroid.check(androidLocationPermission).then(response => callback(response));
    }
  })();
}

const getPermissionIfNecessary = (onSucc, onFail) => {
  getPermissionStatus((isAuthorized, status) => {
    if (!isAuthorized) {
      Platform.select({
        ios: (status) => {
          Alert.alert(
            permissionMessageTitle,
            permissionMessageContent,
            status === 'undetermined' ?
              [{text: 'Ok', onPress: () => Permissions.request('location').then(response => response == 'authorized' ? onSucc() : onFail())}] :
              [{text: 'Deny', style: 'cancel', onPress: onFail}, {text: 'Open Settings', onPress: Permissions.openSettings}]
          );
        },
        android: () => {
          PermissionsAndroid.request(
            androidLocationPermission,
            {
              'title': permissionMessageTitle,
              'message': permissionMessageContent
            }
          ).then(result => result == PermissionsAndroid.RESULTS.GRANTED ? onSucc() : onFail());
        }
      })(status);
    } else {
      onSucc();
    }
  });
}

const getLocation = async () => {
  return new Promise((resolve) => {
    getPermissionStatus((isAuthorized) => {
      if (isAuthorized) {
        navigator.geolocation.getCurrentPosition(
          position => resolve(position), () => resolve(),
          {enableHighAccuracy: true, timeout: 2000, maximumAge: 180000});
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  getPermissionIfNecessary,
  getLocation,
}
