import React, { Component } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import StatusCardBase from '../StatusCardBase';

import Notifications from '../../../../helpers/Notifications';
import T from '../../../widgets/T';
import ConfirmationModal from '../../../widgets/ConfirmationModal';
import {orange} from '../../../../statics/colors';
import Button from '../../../widgets/Button';

const Styles = StyleSheet.create({
  headerText: {
    textAlign: 'center',
    color: orange,
  },
  standardText: {
    marginVertical: 10,
    textAlign: 'center'
  },
  orderStatus: {
    marginVertical: 15,
    alignItems: 'center'
  },
  cancelContainer: {
    alignItems: 'center'
  },
  promptText: {
    textAlign: 'center'
  }
});

let didPrompt = false // prompt once per "session"

export default class CurrentOrders extends Component {
  constructor(props) {
    super(props);
    this.cancelBarId = '';
    this.cancelOrderId = '';
    this.state = {
      showConfirmModal: false,
    };
  }

  confirmCancelOrder(barId, orderId) {
    this.cancelBarId = barId;
    this.cancelOrderId = orderId;
    this.setState({showConfirmModal: true});
  }

  userRespondedToModal(val) {
    if (val) {
      this.props.cancelOrder(this.cancelBarId, this.cancelOrderId);
    }
    this.modal.dismiss();
  }

  renderCurrentOrder({queuePosition, uuid, bar}) {
    return (
      <StatusCardBase key={uuid}>
        <T type="h1" style={Styles.headerText}>Order In Progress</T>
        <T style={Styles.standardText}>You'll get a notification when your order is ready to be picked up. Until then, feel free to browse the menu or place another order!</T>
        <View style={Styles.orderStatus}>
          <T>There are currently</T>
          <T type="h2" style={Styles.headerText}>{queuePosition}</T>
          <T>orders ahead of you</T>
        </View>
        <Button
          onPress={() => this.confirmCancelOrder(bar.uuid, uuid)}
          type="text"
          text="Cancel Order"
          textProps={{weight: 'light'}}/>
      </StatusCardBase>
    );
  }

  render() {
    if (this.props.currentOrders.length > 0 && !didPrompt) {
      didPrompt = true;
      Notifications.getNotificationPermissionIfNeededAndRegister();
    }
    return (
      <View>
        {this.props.currentOrders.map((value) => this.renderCurrentOrder(value))}
        <ConfirmationModal
          visible={this.state.showConfirmModal}
          ref={(r) => this.modal = r}
          title={"Are you sure you want to cancel?"}
          animate={true}
          onDismiss={() => this.setState({showConfirmModal: false})}
          cancelButtonText="No"
          confirmButtonText="Cancel Order"
          onResponse={this.userRespondedToModal.bind(this)}
          message="Your card will not be charged."/>
      </View>
    );
  }
}
