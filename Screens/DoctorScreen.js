import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar, Image, Text, Button, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import Icon from 'react-native-ionicons';
import Moment from 'moment';

export default class DoctorScreen extends Component {
  static navigationOptions = {
    headerTitle: 'Doctor',
    headerBackTitle: '',
    headerTruncatedBackTitle: ''
  };

  CHANGE_DATE_DIRECTION = { BACK: 0, FORWARD: 1 }
  
  state = {
    doctor: {},
    date: Moment().startOf('date'),
    times: []
  };
  
  async componentDidMount() {
    var doctor = await fetch('http://www.docmeapp.com/doctor/' + this.props.navigation.state.params.id, { method: 'GET' })
    .then((response) => { 
      if (response.status == 200) {
        return response.json()
        .then((responseJson) => {
          if (responseJson.isSuccess) {
            return responseJson.doctor;
          }
        })
      }
      return undefined;
    })
    .catch((error) => {
      console.error(error);
      return undefined;
    });
    this.setState({doctor: doctor});
    this.props.navigation.setParams({ headerTitle: this.state.doctor.firstName });
    this.changeTimes();
  }
  
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView />
        <View style={styles.container}>  
          <Image
            style={styles.doctorImage}
            source={{uri: this.state.doctor.imageUrl ? this.state.doctor.imageUrl : ''}}
          />
          <Text style={styles.doctorNameText}>{this.state.doctor.firstName} {this.state.doctor.lastName}</Text>
          <Text style={styles.doctorEmailAddressText}>{this.state.doctor.emailAddress}</Text>
          { this.state.doctor.practice &&
            <Text style={styles.doctorLocationText}>{this.state.doctor.practice.addressLine1} {this.state.doctor.practice.addressLine2} {this.state.doctor.practice.city}, {this.state.doctor.practice.state} {this.state.doctor.practice.postalCode}</Text>
          }
          <View style={styles.doctorStarsView}>  
            <Icon style={styles.starIcon} name="star" />
            <Icon style={styles.starIcon} name="star" />
            <Icon style={styles.starIcon} name="star" />
            <Icon style={styles.starIcon} name="star" />
            <Icon style={styles.starIcon} name="star" />
            <Text style={styles.doctorStarText}>(471)</Text>
          </View>
          <View style={styles.divider}></View>
          <Text style={styles.bookAnAppointmentText}>Book an appointment</Text>
          <View style={styles.dateControl}>
            <TouchableOpacity onPress={() => this.changeDate(this.CHANGE_DATE_DIRECTION.BACK)} hitSlop={styles.dateControlArrowIconHitSlop}>
              <Icon style={styles.dateControlArrowIcon} name="arrow-back" />
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.dateControlLabel}>
                <Icon style={styles.dateControlLabelIcon} name="calendar" />
                <Text style={styles.dateControlLabelText}>  {this.state.date.format('ddd, MMM D')}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.changeDate(this.CHANGE_DATE_DIRECTION.FORWARD)} hitSlop={styles.dateControlArrowIconHitSlop}>
              <Icon style={styles.dateControlArrowIcon} name="arrow-forward" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={this.state.times}
            keyExtractor={item => item.toString()}
            style={styles.timesList}
            horizontal={true}
            renderItem={({item}) => 
              <TouchableOpacity
                style={styles.timeButton}
                underlayColor='#fff'>
                <Text style={styles.timeButtonText}>{item.format('h:mma')}</Text>
              </TouchableOpacity>
            }
            ListEmptyComponent={<Text style={styles.noTimesText}>No times available</Text>}
          />
        </View>
      </>
    );
  }

  changeTimes() {
    var times = [];
    var schedule = this.state.doctor.schedule;
    if (schedule) {
      var dayOfWeek = this.state.date.format('dddd').toLowerCase();
      var availabilityStartTime = this.getTimeFromString(schedule[dayOfWeek + 'AvailabilityStartTime']);
      var availabilityEndTime = this.getTimeFromString(schedule[dayOfWeek + 'AvailabilityEndTime']);
      var breakStartTime = this.getTimeFromString(schedule[dayOfWeek + 'BreakStartTime']);
      var breakEndTime = this.getTimeFromString(schedule[dayOfWeek + 'BreakEndTime']);
      if (availabilityStartTime && availabilityEndTime) {
        var time = Moment(availabilityStartTime);
        while(time.isBefore(availabilityEndTime)) {
          if (!breakStartTime || !breakEndTime || (!time.isSame(breakStartTime) && !time.isBetween(breakStartTime, breakEndTime))) { 
            times.push(Moment(time)); 
          }
          time.add(30, 'minutes');
        }
      }
    }
    this.setState({times: times});
  }

  getTimeFromString(string) {
    return string ? 
      Moment(this.state.date.format('YYYY-MM-DD') + ' ' + string, "YYYY-MM-DD HH:mm:ss") : null;
  }

  changeDate(direction) {
    if (direction == this.CHANGE_DATE_DIRECTION.FORWARD) this.setState({date: this.state.date.add(1, 'days')});
    else if (this.state.date.isSameOrAfter(Moment())) this.setState({date: this.state.date.subtract(1, 'days')});
    this.changeTimes();
  }
};

const DATE_CONTROL_HEIGHT = 30;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  doctorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 10
  },
  doctorNameText: {
    color: Colors.DARK_BLUE,
    fontSize: 20,
    fontFamily: Fonts.MEDIUM,
    marginBottom: 10
  },
  doctorEmailAddressText: {
    color: Colors.DARK_BLUE,
    fontSize: 15,
    fontFamily: Fonts.LIGHT,
    marginBottom: 3
  },
  doctorLocationText: {
    color: Colors.GRAY,
    fontSize: 15,
    fontFamily: Fonts.LIGHT,
    marginBottom: 10
  },
  doctorStarsView: {
    flexDirection: 'row',
    marginBottom: 20
  },
  starIcon: {
    color: Colors.GREEN,
    fontSize: 20,
    marginRight: 2
  },
  doctorStarText: {
    color: Colors.GRAY,
    fontSize: 15,
    fontFamily: Fonts.NORMAL,
    lineHeight: 20
  },
  divider: {
    alignSelf: 'stretch',
    borderBottomWidth: 2,
    borderBottomColor: Colors.LIGHT_GRAY,
    marginBottom: 20
  },
  bookAnAppointmentText: {
    color: Colors.DARK_BLUE,
    fontSize: 17,
    fontFamily: Fonts.BOLD,
    marginBottom: 10
  },
  dateControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignSelf: 'stretch',
    marginBottom: 10,
    marginRight: 20,
    marginLeft: 20
  },
  dateControlLabel: {
    height: DATE_CONTROL_HEIGHT,
    flexDirection: 'row',
  },
  dateControlLabelIcon: {
    height: DATE_CONTROL_HEIGHT,
    lineHeight: DATE_CONTROL_HEIGHT,
    fontSize: 20,
    color: Colors.DARK_GRAY
  },
  dateControlLabelText: {
    color: Colors.DARK_GRAY,
    textAlignVertical: 'center',
    height: DATE_CONTROL_HEIGHT,
    lineHeight: DATE_CONTROL_HEIGHT,
    fontSize: 15,
    fontFamily: Fonts.BOLD
  },
  dateControlArrowIcon: {
    height: DATE_CONTROL_HEIGHT,
    lineHeight: DATE_CONTROL_HEIGHT,
    color: Colors.GREEN,
    fontSize: 30
  },
  dateControlArrowIconHitSlop: {top: 10, bottom: 10, left: 10, right: 10},
  timesList: {
    paddingLeft: 20
  },
  timeButton: {
    color: Colors.WHITE,
    padding: 10,
    backgroundColor: Colors.DARK_BLUE,
    borderRadius: 5,
    marginBottom: 20,
    marginRight: 10
  },
  timeButtonText: {
    color: Colors.WHITE,
    fontSize: 17,
    fontFamily: Fonts.MEDIUM,
    textAlign: 'center'
  },
  noTimesText: {
    color: Colors.DARK_GRAY,
    textAlignVertical: 'center',
    height: 37,
    lineHeight: 37,
    fontSize: 15
  }
})