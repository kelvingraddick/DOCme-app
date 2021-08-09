import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, StatusBar, Image, Text, Button, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MapView from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import { Marker } from 'react-native-maps';
import Genders from '../Constants/Genders';
import Races from '../Constants/Races';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import Icon from 'react-native-ionicons';
import Moment from 'moment';
import { GOOGLE_API_KEY } from 'react-native-dotenv'

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
    times: [],
    mapRegion: {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    mapMarkers: []
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

    Geocoder.init(GOOGLE_API_KEY);
    var coordinates = await Geocoder.from(this.state.doctor.practice.addressLine1 + " " + this.state.doctor.practice.addressLine2 + " " + this.state.doctor.practice.city + ", " + this.state.doctor.practice.state + " " + this.state.doctor.practice.postalCode)
    .then((json) => { 
      return {
        latitude: json.results[0].geometry.location.lat,
        longitude: json.results[0].geometry.location.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      };
    })
    .catch((error) => {
      console.error(error);
      return undefined;
    });
    this.setState({mapRegion: coordinates});
    this.setState({mapMarkers: [coordinates]});
  }
  
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <ScrollView>
          <View style={styles.container}>  
            <Image
              style={styles.doctorImage}
              source={{uri: this.state.doctor.imageUrl ? this.state.doctor.imageUrl : ''}}
            />
            <Text style={styles.doctorNameText}>{this.state.doctor.firstName} {this.state.doctor.lastName}</Text>
            <Text style={styles.doctorEmailAddressText}>{this.state.doctor.emailAddress}</Text>
            <View style={styles.doctorStarsView}>  
              <Icon style={styles.starIcon} name="star" />
              <Icon style={styles.starIcon} name="star" />
              <Icon style={styles.starIcon} name="star" />
              <Icon style={styles.starIcon} name="star" />
              <Icon style={styles.starIcon} name="star" />
              <Text style={styles.doctorStarText}>(471)</Text>
            </View>
            <View style={styles.divider}></View>
            <Text style={styles.sectionTitleText}>Book an appointment</Text>
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
                  underlayColor='#fff'
                  onPress={() => this.props.navigation.navigate('BookAppointmentScreen', { doctor: this.state.doctor, date: this.state.date, time: item })}>
                  <Text style={styles.timeButtonText}>{item.format('h:mma')}</Text>
                </TouchableOpacity>
              }
              ListEmptyComponent={<Text style={styles.noTimesText}>No times available</Text>}
            />
            <View style={styles.divider}></View>
            <Text style={styles.sectionTitleText}>Location</Text>
            <MapView
              style={styles.mapView}
              region={this.state.mapRegion}>
              {this.state.mapMarkers.map(marker => (
                <Marker
                  coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                  title={marker.title}
                  description={marker.description}
                />
              ))}
            </MapView>
            { this.state.doctor.practice &&
              <Text style={styles.doctorLocationText}>{this.state.doctor.practice.addressLine1} {this.state.doctor.practice.addressLine2} {this.state.doctor.practice.city}, {this.state.doctor.practice.state} {this.state.doctor.practice.postalCode}</Text>
            }
            <View style={styles.divider}></View>
            <Text style={styles.sectionTitleText}>About</Text>
            <Text style={styles.doctorDescriptionText}>{this.state.doctor.description}</Text>
            { this.state.doctor.images && this.state.doctor.images.length > 0 &&
              <>
                <View style={styles.divider}></View>
                <Text style={styles.sectionTitleText}>Images</Text>
                <FlatList
                  data={this.state.doctor.images}
                  keyExtractor={item => item.id}
                  style={styles.imagesList}
                  horizontal={true}
                  renderItem={({item}) => 
                    <Image 
                      style={styles.image}
                      source={{
                        uri: item.url
                      }}
                    />
                  }
                />
              </>
            }
            <View style={styles.divider}></View>
            { this.state.doctor && (this.state.doctor.gender || this.state.doctor.race) &&
              <>
                <Text style={styles.sectionTitleText}>Additional Information</Text>
                <Text style={[styles.doctorDescriptionText, { alignSelf: 'flex-start'}]}>
                  Gender - { Genders.find(x => { return x.id === this.state.doctor.gender })?.name || 'Not set'}{'\n'}
                  Race - { Races.find(x => { return x.id === this.state.doctor.race })?.name || 'Not set'}
                </Text>
              </>
            }
          </View>
        </ScrollView>
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
    marginBottom: 5
  },
  doctorEmailAddressText: {
    color: Colors.DARK_BLUE,
    fontSize: 15,
    fontFamily: Fonts.LIGHT,
    marginBottom: 5
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
  doctorDescriptionText: {
    color: Colors.DARK_GRAY,
    fontSize: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15
  },
  divider: {
    alignSelf: 'stretch',
    borderBottomWidth: 2,
    borderBottomColor: Colors.LIGHT_GRAY,
    marginBottom: 10
  },
  sectionTitleText: {
    color: Colors.DARK_BLUE,
    fontSize: 17,
    fontFamily: Fonts.BOLD,
    marginBottom: 12
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
    maxHeight: 60,
    paddingLeft: 20,
    marginBottom: 15
  },
  timeButton: {
    color: Colors.WHITE,
    padding: 10,
    backgroundColor: Colors.DARK_BLUE,
    borderRadius: 5,
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
  },
  mapView: {
    height: 150,
    alignSelf: 'stretch',
    marginBottom: 10
  },
  imagesList: {
    height: 165,
    paddingLeft: 15
  },
  image: {
    height: 150,
    width: 150,
    marginRight: 15
  }
})