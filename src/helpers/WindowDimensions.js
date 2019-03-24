import {Dimensions, StatusBar, Platform} from 'react-native'

const getWidth = () => {
  return Dimensions.get('window').width;
};

const getHeight = () => {
  const windowHeight = Dimensions.get('window').height;
  return Platform.select({
    ios: windowHeight,
    android: windowHeight - StatusBar.currentHeight,
  });
};

const width = getWidth();
const height = getHeight();

module.exports = {
  width,
  height
}