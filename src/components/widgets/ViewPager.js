// Renders multiple "Pages" horizontally. Assumes that it has full screen width
// Note that the 'page' prop will move 

import React, { Component } from 'react';
import { View, 
  FlatList,
  ScrollView, 
  StyleSheet,
  TouchableOpacity } from 'react-native';

import T from './T';
import {orange} from '../../statics/colors';
import WindowDimensions from '../../helpers/WindowDimensions'

const WINDOW_WIDTH = WindowDimensions.width;

const headerStyles = {
  paddingHorizontal: 15,
  paddingBottom: 3,
  paddingTop: 10,
};

const Styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%'
  },
  header: {
    ...headerStyles
  },
  activeHeader: {
    ...headerStyles,
    color: orange
  },
  headerList: {
    borderBottomWidth: 1
  },
  pageContainer: {
    width: WINDOW_WIDTH,
    height: '100%',
  }
});

export default class ViewPager extends Component {
  constructor(props) {
    super(props);
    this.headerWidths = [];
    this.headerWidthsCumulative = [];
    this.state = {
      headerIndex: 0,
      headerPaddingBefore: 0,
      headerPaddingAfter: 0,
      headerPressed: false
    }
    this.pagerScrolled = this.pagerScrolled.bind(this);
    this.pagerScrolledEnd = this.pagerScrolledEnd.bind(this);
  }

  componentDidMount() {
    if (this.props.showHeaders && this.props.page && this.state.headerIndex != this.props.page) {
      setTimeout(() => this.headerPressed(this.props.page), 100);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.page != this.props.page) {
      if (this.props.showHeaders) {
        this.headerPressed(nextProps.page);
      } else {
        this.scrollPager(nextProps.page)
      }
    }
  }

  onHeaderLayout(index, event) {
    const width = event.nativeEvent.layout.width;
    this.headerWidths[index] = width;
    if (index == 0) {
      this.setState({
        headerPaddingBefore: (WINDOW_WIDTH - width) / 2
      });
    } else if (index == this.props.pages.length - 1) {
      this.setState({
        headerPaddingAfter: (WINDOW_WIDTH - width) / 2,
      })
    }
    let sum = 0;
    this.headerWidths.map((val, index) => {
      this.headerWidthsCumulative[index] = sum;
      sum += val;
    });
  }

  scrollPager(index) {
    this.pager.scrollToIndex({index, viewPosition: 0, viewOffset: 0});
  }

  headerPressed(index) {
    this.setState({
      headerIndex: index,
      headerPressed: true
    });
    this.headers.scrollTo({x: this.calcScrollXToCenterHeader(index), y: 0, animated: true});
    this.scrollPager(index);
  }

  getHeaders() {
    return [<View key="paddingBefore" style={{width: this.state.headerPaddingBefore}}/>,
     ...this.props.pages.map((item, index) => {
      const style = this.state.headerIndex == index ? Styles.activeHeader : Styles.header;
      return (
        <TouchableOpacity
          key={item.key || index} 
          onPress={() => this.headerPressed(index)}
          onLayout={(event) => this.onHeaderLayout(index, event)}>
          <T 
            type="h2" 
            style={style}>
            {item.header}
          </T>
        </TouchableOpacity>
      );
    }),
    <View key="paddingAfter" style={{width: this.state.headerPaddingAfter}}/>]
  }

  calcScrollXToCenterHeader(index) {
    let scrollX = this.state.headerPaddingBefore + this.headerWidthsCumulative[index];
    return scrollX - (WINDOW_WIDTH - this.headerWidths[index]) / 2;
  }

  pagerScrolled(event) {
    if (this.props.showHeaders && !this.state.headerPressed) {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const fraction = (contentOffsetX % WINDOW_WIDTH) / WINDOW_WIDTH;
      if (fraction == 0 ||
          contentOffsetX > WINDOW_WIDTH * (this.props.pages.length - 1) || 
          contentOffsetX < 0) {
        return;
      }
      let index1, index2;
      if (this.state.headerIndex * WINDOW_WIDTH < contentOffsetX) {
        // Scrolling right
        index2 = this.state.headerIndex;
        index1 = index2 + 1;
      } else if (this.state.headerIndex > 0) {
        // Scrolling left
        index1 = this.state.headerIndex;
        index2 = index1 - 1;
      } else {
        return;
      }
      const distance = this.calcScrollXToCenterHeader(index1) - this.calcScrollXToCenterHeader(index2);
      const scrollToX = this.calcScrollXToCenterHeader(index2) + fraction * distance;
      this.headers.scrollTo({x: scrollToX, y: 0, animated: false});
    }
  }

  pagerScrolledEnd(event) {
    if (this.props.showHeaders) {
      const index = Math.ceil(event.nativeEvent.contentOffset.x / WINDOW_WIDTH);
      this.setState({
        headerIndex: index,
        headerPressed: false
      });
    }
  }

  renderItem(item) {
    const ItemComponent = item.item.component;
    return (
      <View style={Styles.pageContainer} key={item.index}>
        <ItemComponent {...item.item.props} />
      </View>
    );
  }

  keyExtractor(item, index) {
    return index;
  }

  getItemLayout(item, index) {
    return {offset: WINDOW_WIDTH * index, length: WINDOW_WIDTH, index};
  }

  render() {
    const headers = this.props.showHeaders && 
      <View>
        <ScrollView 
          ref={(r) => this.headers = r}
          style={Styles.headerList}
          horizontal={true} 
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always">
          {this.getHeaders()}
        </ScrollView>
      </View>;
    return (
      <View style={Styles.container}>
        {headers}
        <FlatList
          ref={(r) => this.pager = r}
          horizontal={true}
          pagingEnabled={true}
          scrollEnabled={typeof this.props.scrollEnabled == 'undefined' || this.props.scrollEnabled}
          showsHorizontalScrollIndicator={false}
          data={this.props.pages}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={this.keyExtractor}
          getItemLayout={this.getItemLayout}
          onScroll={this.pagerScrolled}
          onMomentumScrollEnd={this.pagerScrolledEnd}
          scrollEventThrottle={30}/>
        </View>
      );
  }
}
