// Simple wrapper for DataPicker component for styling purposes

import React, { Component } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableHighlight,
  Platform } from 'react-native';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';
import T from './T';

import moment from 'moment';

import {Styles as TextInputStyles, LABEL_MOVE_ANIMATION_DURATION} from './TextInputWithLabel';

export const DATE_FORMAT = "MMMM Do, YYYY";

const dateText = StyleSheet.flatten([TextInputStyles.textInput, {fontSize: 16}]);

const Styles = StyleSheet.create({
  container: {
    height: TextInputStyles.textInputArea.height
  },
  smallLabel: StyleSheet.flatten([TextInputStyles.smallLabel, {
    backgroundColor: 'transparent'
  }]),
  largeLabel: StyleSheet.flatten([TextInputStyles.largeLabel, {
    backgroundColor: 'transparent'
  }]),
  datePicker: {
    width:'100%',
  },
  dateInput: StyleSheet.flatten([TextInputStyles.textInputArea, {
    borderWidth: 0,
  }]),
  dateTouchBody: {height: TextInputStyles.textInputArea.height, flex: 1},
  dateText,
  dateTextAndroid: StyleSheet.flatten([dateText, {
    position: 'absolute',
    zIndex: 2,
    // top: TextInputStyles.largeLabel.top,
    // left: TextInputStyles.largeLabel.left,
    top: 21,
    left: 5,
  }])
});

export default class DateInput extends Component {
  constructor(props) {
    super(props);
    this.dateChanged = this.dateChanged.bind(this);
  }

  dateChanged(date) {
    this.props.onChangeDate(moment(date, DATE_FORMAT).format());
  }

  focus() {
    this.datePicker.onPressDate();
  }

  onOpenModal() {
    this.props.onChangeDate(moment().subtract(21, 'years').toDate());
  }

  render() {
    const date = this.props.value && moment(this.props.value).format(DATE_FORMAT);
    return (
      <View style={TextInputStyles.container}>
        <TouchableHighlight
          onPress={this.focus.bind(this)}>
          <View style={Styles.container}>
            <DatePicker
              ref={(r) => this.datePicker = r}
              style={Styles.datePicker}
              customStyles={Styles}
              onOpenModal={this.onOpenModal.bind(this)}
              mode="date"
              format={DATE_FORMAT}
              placeholder=" "
              date={date}
              onDateChange={this.dateChanged}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}/>
            <Animatable.Text duration={LABEL_MOVE_ANIMATION_DURATION} transition={["fontSize", "left", "top"]} style={this.props.value ? Styles.smallLabel : Styles.largeLabel}>
              Date of Birth
            </Animatable.Text>
            {Platform.OS == "android" && <T style={Styles.dateTextAndroid}>{date}</T>}
          </View>
        </TouchableHighlight>
        <T style={TextInputStyles.invalidText}>
          {this.props.validationMessage}
        </T>
      </View>
    );
  }
}
