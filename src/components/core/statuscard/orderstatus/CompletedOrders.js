import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
} from 'react-native';

import WindowDimensions from '../../../../helpers/WindowDimensions';
import StatusCardBase from '../StatusCardBase'
import T from '../../../widgets/T';
import {orange} from '../../../../statics/colors';

const Styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  headerText: {
    textAlign: 'center',
    color: orange,
  },
  image: {
    width: WindowDimensions.width * .7,
    height: 200,
  },
  promptText: {
    textAlign: 'center',
  }
});

export default class CompletedOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {modalVisible: false};
  }

  renderCompletedOrder(order) {
    return (
      <View key={order.uuid}>
        <TouchableHighlight
          onPress={() => this.props.showOrderCodeModal(order)}>
          <StatusCardBase style={Styles.container}>
            <T type="h1" style={Styles.headerText}>Your Order is Ready!</T>
              <Image 
                style={Styles.image}
                source={require('../../../../statics/images/logonotype.png')}
                resizeMode="contain"/>
            <T type="h1" style={Styles.promptText}>Tap to get your pickup code</T>
          </StatusCardBase>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    return (
      <View>
        {this.props.completedOrders.map(value => this.renderCompletedOrder(value))}
      </View>
    );
  }
}
