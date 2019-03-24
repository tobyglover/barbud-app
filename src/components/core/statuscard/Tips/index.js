import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import TipButton from './TipButton';
import CustomTipButton from './CustomTipButton';
import {raiseErrorMessage, formatPriceInCents} from '../../../../helpers/Helpers'
import WindowDimensions from '../../../../helpers/WindowDimensions'
import T from '../../../widgets/T'

export const ORDER_PRICE_MIN_FOR_PERCENTAGES = 667;
const CONTAINER_WIDTH = WindowDimensions.width * .85;
const BUTTON_PADDING = 5;

const Styles = StyleSheet.create({
  buttonContainer: {
    width: CONTAINER_WIDTH,
    marginVertical: 5
  },
  orderMessage: {
    marginLeft: 10
  },
  center: {
    alignItems: 'center'
  },
  prompt: {
    marginTop: 10,
    marginHorizontal: 20
  }
});

export default class Tips extends Component {
  addTipToOrder(amount) {
    this.props.addTipToOrder(this.props.order, amount);
  }

  renderMessages() {
    const message = this.props.order && this.props.order.messages && this.props.order.messages.placeTip;
    if (message) {
      return <T type="h4" style={Styles.orderMessage}>{message}</T>;
    }
  }

  render() {
      if (this.props.apiStatus == "error") {
        raiseErrorMessage("There was an problem adding a tip to your order. Please try again.", () => this.props.clearAPIStatus(this.props.order.uuid));
      }
      const numButtons = this.props.order.tipOptions.length + 1;
      const totalButtonPadding = BUTTON_PADDING * (numButtons - 1);
      const buttonWidth = CONTAINER_WIDTH / numButtons;
      let tipButtons = null;

      if (this.props.order.tipInCents) {
        tipButtons =
          <TipButton
            selected={true}
            width={buttonWidth}
            containerWidth={CONTAINER_WIDTH + totalButtonPadding}
            startPosition={0}
            selectedColor='green'
            apiStatus='success' // this is a hack to get the green checkmark
            percentage={(this.props.order.tipInCents / this.props.order.totalPriceInCents).toFixed(2)}
            mainText={formatPriceInCents(this.props.order.tipInCents)}/>
      } else {
        tipButtons = this.props.order.tipOptions.map((value, index) =>
          <TipButton
            key={index}
            startPosition={(buttonWidth + BUTTON_PADDING) * index}
            width={buttonWidth}
            containerWidth={CONTAINER_WIDTH + totalButtonPadding}
            mainText={this.props.order.tipDisplayType == "percentages" ? Math.round(value / this.props.order.totalPriceInCents * 100) + "%" : formatPriceInCents(value)}
            onSelect={() => this.addTipToOrder(value)}
            unselect={this.props.apiStatus == "error"}
            apiStatus={this.props.apiStatus}/>
        );
      }
      return (
        <View>
          <View style={Styles.prompt}>
            <T type="h3">{this.props.prompt}</T>
            {this.renderMessages()}
          </View>
          <View style={Styles.center}>
            <View style={StyleSheet.flatten([Styles.buttonContainer, {marginLeft: -totalButtonPadding, height: buttonWidth}])}>
              {tipButtons}
              <CustomTipButton
                width={buttonWidth}
                startPosition={(buttonWidth + BUTTON_PADDING) * (numButtons - 1)}
                containerWidth={CONTAINER_WIDTH + totalButtonPadding}
                orderTotal={this.props.order.totalPriceInCents}
                maxTipInCents={this.props.order.maxTipInCents}
                onSelect={this.addTipToOrder.bind(this)}
                unselect={this.props.apiStatus == "error"}
                apiStatus={this.props.apiStatus}/>
            </View>
          </View>
        </View>
      );
  }
}
