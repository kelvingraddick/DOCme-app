import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar, Image, Text, Button } from 'react-native';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import Icon from 'react-native-ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class DoctorScreen extends Component {
  static navigationOptions = {
    headerTitle: "Doctor",
    headerBackTitle: "",
    headerTruncatedBackTitle: ""
  };
  
  state = {
    doctor: {}
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
            <Icon style={styles.doctorStarIcon} name="star" />
            <Icon style={styles.doctorStarIcon} name="star" />
            <Icon style={styles.doctorStarIcon} name="star" />
            <Icon style={styles.doctorStarIcon} name="star" />
            <Icon style={styles.doctorStarIcon} name="star" />
            <Text style={styles.doctorStarText}>(471)</Text>
          </View>
          <View style={styles.divider}></View>
          <Text style={styles.bookAnAppointmentText}>Book an appointment</Text>
          <View style={styles.dateControl}>
            <TouchableOpacity><Icon style={styles.doctorStarIcon} name="arrow-back" /></TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.dateControlLabel}>
                <Icon style={styles.dateControlLabelIcon} name="calendar" />
                <Text style={styles.dateControlLabelText}> Wed, Mar 11</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity><Icon style={styles.doctorStarIcon} name="arrow-forward" /></TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20
  },
  doctorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  doctorStarIcon: {
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
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dateControlLabel: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  dateControlLabelIcon: {
    color: Colors.DARK_GRAY,
    fontSize: 20
  },
  dateControlLabelText: {
    color: Colors.DARK_GRAY,
    textAlignVertical: 'center',
    fontSize: 15,
    fontFamily: Fonts.BOLD
  }
})