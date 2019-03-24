import {Alert, Linking, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import creditCardType, { getTypeInfo, types as CardType } from 'credit-card-type';
import {email} from '../statics/strings'

export const StripeCardBrandToCardTypes = {
  "Visa": CardType.VISA, 
  "American Express": CardType.AMERICAN_EXPRESS, 
  "MasterCard": CardType.MASTERCARD, 
  "Discover": CardType.DISCOVER, 
  "JCB": CardType.JCB, 
  "Diners Club": CardType.DINERS_CLUB, 
  "Unknown": "placeholder"
};

export const metersToMiles = (meters) => meters / 1609.344;

export const formatPriceInCents = (priceInCents) => {
  return "$" + (priceInCents / 100).toFixed(2);
};

export const formatTipPercentage = percentage => {
  return Math.round(percentage * 100) + "%";
}

export const raiseErrorMessage = (msg, onClose, headerText = "Error") => {
  if (!msg) {
    msg = "There was an error processing your request. Please try again."
  }
  Alert.alert(
    headerText,
    msg,
    [{text: 'Ok', onPress: onClose}]
  );
}

export const prettyCardNumber = (lastDigits, cardType) => {
  const bullet = '\u25CF';
  let cardNumber = lastDigits;
  let length = 16;
  let gaps = [4, 8, 12];

  let card = getTypeInfo(cardType);
  if (card) {
    length = card.lengths[0];
    gaps = card.gaps;
  }
  if (cardNumber.length < length) {
    cardNumber = bullet.repeat(length - cardNumber.length) + cardNumber;
  }

  let components = [];
  gaps.unshift(0);
  gaps.push(cardNumber.length);
  
  for (let i = 0; i < gaps.length - 1; i++) {
    let start = gaps[i];
    let end = Math.min(gaps[i + 1], cardNumber.length);
    components.push(cardNumber.substring(start, end));
  }

  return components.join('  ');
}

export const openURL = url => {
  if (!Linking.canOpenURL(url)) {
    return false;
  }
  Linking.openURL(url);
  return true;
}

export const sendFeedBackEmail = () => {
  const emailURL = "mailto:" + email + "?Subject=Barbud%20Feedback&body=" + getFeedBackEmailBody();
  return openURL(emailURL);
}

export const getCurrentRouteName = (navigationState) => {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}

function getFeedBackEmailBody() {
  let osVersion = DeviceInfo.getSystemVersion();
  if (Platform.OS == "android") {
    osVersion += ` (${DeviceInfo.getAPILevel()})`;
  }

  return (
    `

    -------------------------------------------
    Please leave your feedback above this line.

    This information is used to better understand the feedback you are giving. It contains no personally identifiable information, but if you are at all uncomfortable with providing it please feel free to delete some or all of it.

    Manufacturer: ${DeviceInfo.getManufacturer()}
    Model: ${DeviceInfo.getModel()}
    OS Version: ${osVersion} 
    BarBud Version: ${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()}) 
    `
  );
}
