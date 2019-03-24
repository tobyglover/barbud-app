// Styles that are used across multiple components

import {StyleSheet} from 'react-native';

import {gray, orange} from './colors';

export const FillBackgroundGray = StyleSheet.flatten({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: gray
  });

export const FillBackgroundOrange = StyleSheet.flatten({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: orange
  });

export const FillBackgroundWhite = StyleSheet.flatten({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white'
  });

export const FillBackgroundLightGray = StyleSheet.flatten({
  ...StyleSheet.absoluteFillObject,
  backgroundColor: '#f7f7f7'
});
