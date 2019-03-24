import React, { Component } from 'react';
import { View,
  StyleSheet
} from 'react-native';

import T from '../../widgets/T';
import Button from '../../widgets/Button';
import Modal from '../../widgets/Modal';
import NavigationImage from '../../widgets/NavigationImage';

const imageSize = 30;
const Styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20
  },
  quantity: {
    paddingHorizontal: 20,
    width: 75,
    textAlign: 'center'
  }
});

export default class DrinkModal extends Component {
  increment() {
    this.props.modifyQuantityItem(this.props.quantity + 1)
  }

  decrement() {
    this.props.modifyQuantityItem(this.props.quantity - 1)
  }

  addToOrder() {
    if (this.props.hasPendingOrder) {
      this.props.updateOrder({drinkId: this.props.drink.uuid, categoryId: this.props.drink.categoryId, quantity: this.props.quantity});
      this.props.addToOrder();
    } else {
      this.props.addToOrder();
      this.props.createOrder();
    }
    this.modal.dismiss();
  }

  render() {
    let buttonType = "CTAButtonOrange";
    let buttonText = this.props.isInOrder ? "Modify Order" : "Add To Order";
    if (this.props.quantity == 0) {
      if (this.props.isInOrder) {
        buttonText = "Remove From Order";
        buttonType = "CTAButtonRed";
      } else {
        buttonText = "Cancel";
      }
    }
    return (
      <Modal 
        ref={(r) => this.modal = r}
        title={this.props.drink && this.props.drink.name}
        dismissable={true}
        onDismiss={this.props.dismiss}
        animate={true}
        visible={this.props.show}>
        <View style={Styles.container}>
          <View style={Styles.quantityContainer}>
            <NavigationImage 
              type="-"
              color="orange"
              onPress={this.decrement.bind(this)}
              clickable={true}
              size={imageSize}/>
            <T type="h1" style={Styles.quantity}>{this.props.quantity}</T>
            <NavigationImage 
              type="+"
              color="orange"
              onPress={this.increment.bind(this)}
              clickable={true}
              size={imageSize}/>
          </View>
          <Button text={buttonText} type={buttonType} onPress={this.addToOrder.bind(this)}/>
        </View>
      </Modal>
    ); 
  }
}
