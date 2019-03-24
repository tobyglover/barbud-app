import React, { Component } from 'react';
import {
  StyleSheet, 
} from 'react-native';
import moment from 'moment-timezone';

import T from '../../widgets/T';

const SECOND = 1000;
const MINUTE = 60 * SECOND;

const Styles = StyleSheet.create({
  hoursEvent: {
    textAlign: 'center',
    color: '#ff4242',
    paddingTop: 10,
    paddingHorizontal: 10
  }
});

export default class Venue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      diff: null,
      opensAt: {}
    };
  }

  componentWillMount() {
    this.calculateTimeToNextHoursEvent();
  }

  componentDidReceiveProps() {
    this.calculateTimeToNextHoursEvent();
  }

  componentWillUnmount() {
    clearTimeout(this.nextHoursTimeout);
  }

  createTime(time) {
    return moment.tz(time, "HH:mm:ss", this.props.timeZone);
  }

  getNextHours(now) {
    const today = parseInt(now.format('d'));
    for (let i = 0; i < this.props.hours.length; i++) {
      if (today < parseInt(moment().day(this.props.hours[i].dayOfWeekName).format('d'))) {
        return this.props.hours[i];
      }
    }
    return this.props.hours[0];
  }

  getImportantHours(now) {
    let currentActiveHours,
        currentHours,
        nextHours = null;
    if (Array.isArray(this.props.hours)) {
      this.props.hours.forEach(val => {
        if (currentActiveHours && !nextHours) {
          nextHours = val;
        }
        if (val.active) {
          currentActiveHours = val;
        }
        if (val.dayOfWeekName === now.format("dddd")) {
          currentHours = val;
        }
      });

      if (!nextHours) {
        if (currentActiveHours) {
          // wraps to sunday
          nextHours = this.props.hours[0];
        } else {
          nextHours = this.getNextHours(now);
        }
      }
    }

    currentHours = currentActiveHours && 
                   this.createTime(currentActiveHours.closesAt).isAfter(now) ?
                   currentActiveHours : 
                   currentHours;

    return {currentHours, nextHours};
  }

  calculateTimeToNextHoursEvent() {
    let diff = null;
    let isOpen = false;
    let opensAt = {};

    if (this.props.hours && this.props.hours.length > 0) {
      const now = moment.tz(this.props.timeZone);
      const {currentHours, nextHours} = this.getImportantHours(now);

      if (currentHours) {
        const closes = this.createTime(currentHours.closesAt).day(currentHours.dayOfWeekName);
        const opens = this.createTime(currentHours.opensAt).day(currentHours.dayOfWeekName);

        if (closes.isBefore(opens)) {
          closes.add(1, 'day');
        }

        isOpen = now.isBetween(opens, closes);
        console.log(now.format());
        console.log(opens.format());
        console.log(closes.format());
        if (isOpen) {
          diff = moment.duration(closes.diff(now));
        } else if (currentHours.dayOfWeekName === now.format("dddd")) {
          // before opening
          diff = moment.duration(opens.diff(now));
          opensAt.moment = opens;
        }
      }

      if (!diff) {
        // after closing or no current hours - say when it will open next
        const nextOpens = this.createTime(nextHours.opensAt).day(nextHours.dayOfWeekName);
        diff = moment.duration(nextOpens.diff(now));
        opensAt.moment = nextOpens;
        opensAt.dayOfWeekName = nextHours.dayOfWeekName;
      }

      let timeout = MINUTE;
      if (diff.asMinutes() < 1 && diff.asMinutes() > 0) {
        // Precisely open or close at the correct time
        timeout = diff.asSeconds() * SECOND;
      } else {
        // Normalize to the minute for better experience
        const fractionSeconds = diff.asMinutes() - Math.floor(diff.asMinutes());
        if (fractionSeconds > 0.05 && fractionSeconds < 0.95) {
          timeout = fractionSeconds * MINUTE;
        }
      }
      this.nextHoursTimeout = setTimeout(this.calculateTimeToNextHoursEvent.bind(this), timeout);
    } else {
      isOpen = true;
    }

    console.log(diff)

    this.setState({type: isOpen ? "closes" : "opens", diff, opensAt});
    this.props.isBarOpen(isOpen);
  }

  render() {
    const {type, diff, opensAt} = this.state;
    if (!diff || (type == 'closes' && diff.asMinutes() > 30)) {
      return null;
    }

    let string = "";

    if (type == 'opens') {
      string = `Currently closed. Reopens ${opensAt.dayOfWeekName || "Today"} at ${this.createTime(opensAt.moment).format("h:mm a")}`;
    } else if (type == 'closes') {
      string = `Closes ${diff.humanize(true)}`;
    }
    return <T weight="bold" type="h3" style={Styles.hoursEvent}>{string}</T>
  }
}
