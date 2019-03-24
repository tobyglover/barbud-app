import React, { Component } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Platform
} from 'react-native';

import TipButton from './TipButton';
import T from '../../../widgets/T';
import Button from '../../../widgets/Button';
import {formatPriceInCents} from '../../../../helpers/Helpers';
import {ORDER_PRICE_MIN_FOR_PERCENTAGES} from '../orderstatus/HistoryOrders';
import {orange} from '../../../../statics/colors';

const initialState = {
  status: '',
  dollarAmount: 0,
};

const fontSize = 16;
const Styles = StyleSheet.create({
  confirmButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 3,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  confirmPromptContainer: {
    padding: 10,
    backgroundColor: 'transparent'
  },
  confirmPrompt: {
    textAlign: 'center',
    fontSize: fontSize + 2
  },
  confirm: {
    color: 'green',
    fontSize
  },
  cancel: {
    color: orange,
    fontSize
  },
  textInputContainer: {
    width: 100, 
    ...Platform.select({
      ios: {},
      android: {
        height: 40,
        alignItems: 'center',}
    })
  },
  selectedButtonContainerStyle: {
    ...Platform.select({
      ios: {},
      android: {marginTop: -20}
    })
  },
  textInput: {
    ...Platform.select({
      ios: {textAlign: 'center'},
      android: {position: 'absolute', width: 100, textAlign: 'center', bottom: -15}
    })
  }
})

export default class CustomTipButton extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  abovePriceThreshold() {
    return this.props.orderTotal > ORDER_PRICE_MIN_FOR_PERCENTAGES
  }

  shouldConfirm() {
    return this.state.dollarAmount > this.props.maxTipInCents;
  }

  calcPercentage() {
    return this.state.dollarAmount / this.props.orderTotal;
  }

  onSelect() {
    this.setState({status: 'selected'});
  }

  onUnselect() {
    this.setState(initialState);
  }

  tipChanged(formattedTip) {
    const dollarAmount = parseInt(formattedTip.replace(/\D/g, ''));
    this.setState({dollarAmount});
  }

  submitTip() {
    this.setState({status: 'sent'});
    this.props.onSelect(this.state.dollarAmount);
  }

  onDoneEditing() {
    if (this.state.dollarAmount > 0) {
      if (this.shouldConfirm()) {
        this.setState({status: 'confirm'});
      } else {
        this.submitTip();
      }
    } else {
      this.onUnselect();
    }
  }

  onCancel() {
    this.setState({status: 'selected'})
  }

  render() {
    let mainText = this.state.status ? null : "Custom";
    let mainComponent = null;
    let percentage = this.state.status && this.state.status != 'confirm' && this.abovePriceThreshold() ? this.calcPercentage() : null;
    if (this.state.status == 'selected') {
      mainComponent = (
        <View style={Styles.textInputContainer}>
          <TextInput
            ref={(r) => this.input = r}
            style={Styles.textInput}
            onChangeText={this.tipChanged.bind(this)}
            value={formatPriceInCents(this.state.dollarAmount)}
            autoCorrect={false}
            autoFocus={true}
            caretHidden={false}
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={() => this.input && this.input.blur()}
            onBlur={this.onDoneEditing.bind(this)}
            underlineColorAndroid="transparent"/>
        </View>
        );
    } else if (this.state.status == "confirm") {
      mainComponent = (
          <View style={Styles.confirmPromptContainer}>
            <T style={Styles.confirmPrompt}>The max tip for this order is {formatPriceInCents(this.props.maxTipInCents)}</T>
            <View style={Styles.confirmButtonContainer}>
              <Button 
                onPress={this.onCancel.bind(this)}
                type="text"
                text="Edit Tip"
                textProps={{style: Styles.cancel}}/>
            </View>
          </View>
        );
    } else if (this.state.status == "sent") {
      mainText = formatPriceInCents(this.state.dollarAmount);
    }

    return (
      <TipButton 
        {...this.props}
        buttonContainerStyle={this.state.status == 'selected' && Styles.selectedButtonContainerStyle}
        unselect={!this.state.status || this.props.unselect}
        selectedColor='black'
        onSelect={this.onSelect.bind(this)}
        onUnselect={this.onUnselect.bind(this)}
        mainText={mainText}
        mainComponent={mainComponent}
        percentage={percentage}/>
    );
  }
} 
