import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import SignUpPaymentInfoContainer from '../../../../containers/signup/SignUpPaymentInfoContainer';

import StatusCardBase from '../StatusCardBase';
import T from '../../../widgets/T';
import Modal from '../../../widgets/Modal';
import LoadingIndicator from '../../../widgets/LoadingIndicator';
import Button from '../../../widgets/Button';
import DrinkItem from '../../Venue/DrinkItem';
import {formatPriceInCents, raiseErrorMessage} from '../../../../helpers/Helpers';
import {orange} from '../../../../statics/colors';

export const Styles = StyleSheet.create({
  container: {
    padding: 10
  },
  centerText: {
    textAlign: 'center',
  },
  orderItems: {
    paddingBottom: 10,
    borderBottomWidth: 1
  },
  billingItem: {
    marginVertical: 5,
    marginLeft: 35,
    flexDirection: 'row'
  },
  billingItemTitle: {
    flex: 1
  },
  totalPrice: {
    marginVertical: 10,
    textAlign: 'right',
    color: orange
  },
  buttonContainer: {
    alignItems: 'center'
  },
  orderButton: {
    width: '70%',
  }
});

export default class PendingOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoading: false,
      promptForCard: false,
      showAddCardModal: false,
    };
  }

  componentWillMount() {
    this.props.getUserInfo();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.apiStatus.cardCheck !== nextProps.apiStatus.cardCheck && this.props.show) {
      if (!nextProps.apiStatus.cardCheck) { // success
        this.processPayment();
        this.setState({showLoading: false});
      } else if (nextProps.apiStatus.cardCheck == 'error') {
        raiseErrorMessage("Error placing order, please try again");
      }
    }
  }

  getOrderItems() {
    return this.props.order && Array.isArray(this.props.order.items) ?
      this.props.order.items.map((value, index) => {
        const drink = value.drink;
        drink.categoryId = value.category.uuid;
        return <DrinkItem
          key={drink.uuid}
          showTotal={true}
          onPress={() => this.props.orderItemPressed(drink)}
          quantity={value.quantity}
          item={drink}
          showSeperator={index < this.props.order.items.length - 1}/>
        })
      : null;
  }

  getBillingItems() {
    switch (this.props.apiStatus.pendingOrder) {
      case 'loading':
        return <ActivityIndicator />
      case 'error':
        return <T type="h4" style={{textAlign: 'center'}}>Error loading info</T>
      default:
        return (
          <View>
            <View style={Styles.billingItem}>
              <T type="h4" style={Styles.billingItemTitle}>Tax and Convenience Fee</T>
              <T type="h4">{formatPriceInCents(this.props.order.fees)}</T>
            </View>
            {<T type="h2" style={Styles.totalPrice}>{"Total: " + formatPriceInCents(this.props.order.totalPriceInCentsWithFees)}</T>}
          </View>
        );
    }
  }

  getMessages() {
    const message = this.props.order && this.props.order.messages && this.props.order.messages.placeOrder;
    if (message) {
      return <T type="h4" style={{textAlign: 'center'}}>{message}</T>;
    }
  }

  processPayment() {
    if (this.props.hasCard) {
      if (this.props.apiStatus.pendingOrder == 'error') {
        this.props.resendOrder();
      } else {
        this.props.placeOrder();
      }
    } else {
      this.setState({promptForCard: true})
    }
  }

  buttonPressed() {
    if (!this.props.hasCard) {
      this.setState({showLoading: true});
      this.props.getUserInfo();
    } else {
      this.processPayment();
    }
  }

  promptForCardModalDismissed() {
    this.setState({promptForCard: false, showAddCardModal: true})
  }

  dismissPromptForCardModal() {
    this.promptForCardModal.dismiss();
  }

  dismissAddCardModal() {
    this.setState({showAddCardModal: false});
  }

  render() {
    if (this.props.show) {
      return (
        <StatusCardBase style={{padding: 0}}>
          <View style={Styles.container}>
            <T style={Styles.centerText}>Tap a drink to edit</T>
            <View style={Styles.orderItems}>
              {this.getOrderItems()}
            </View>
            {this.getBillingItems()}
            <View style={Styles.buttonContainer}>
              <Button
                containerStyle={Styles.orderButton}
                text={this.props.apiStatus.pendingOrder == 'error' ? 'Retry' : "Place Order"}
                onPress={this.buttonPressed.bind(this)}
                disabled={this.props.apiStatus.pendingOrder == 'loading'}/>
            </View>
            {this.getMessages()}
          </View>
          {(this.props.apiStatus.placeOrder == 'loading' || this.state.showLoading) && <LoadingIndicator text="Placing Order"/>}
          <SignUpPaymentInfoContainer
            statusBarIsHidden
            visible={this.state.showAddCardModal}
            onDismiss={this.dismissAddCardModal.bind(this)}/>
          <Modal
            noHeader
            dismissable={false}
            ref={(r) => this.promptForCardModal = r}
            visible={this.state.promptForCard}
            onDismiss={this.promptForCardModalDismissed.bind(this)}>
            <T style={Styles.centerText}type="h1">A payment method is required before placing an order</T>
            <Button
              text="Add Card"
              onPress={this.dismissPromptForCardModal.bind(this)}/>
          </Modal>
        </StatusCardBase>
      );
    } else {
      return null;
    }
  }
}
