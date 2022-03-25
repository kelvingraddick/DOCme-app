import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import RatingStarsView from '../Components/RatingStarsView';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';

export default class DoctorRowView extends Component {
  render() {
    return (
      <View style={styles.doctorView}> 
        <Image
          style={styles.doctorImage}
          source={{uri: this.props.doctor.imageUrl ? this.props.doctor.imageUrl : ''}}
        />
        <View style={styles.doctorDetailsView}>  
          <Text style={styles.doctorNameText}>{this.props.doctor.firstName} {this.props.doctor.lastName}</Text>
          <Text style={styles.doctorEmailAddressText}>{this.props.doctor.emailAddress}</Text>
          { this.props.doctor.practice &&
            <Text style={styles.doctorLocationText}>{this.props.doctor.practice.addressLine1} {this.props.doctor.practice.addressLine2} {this.props.doctor.practice.city}, {this.props.doctor.practice.state} {this.props.doctor.practice.postalCode}</Text>
          }
          <View style={styles.doctorStarsView}>  
            <RatingStarsView doctor={this.props.doctor} />
          </View>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  doctorView: {
    flexDirection: 'row',
    padding: 20
  },
  doctorImage: {
    width: 70,
    height: 70,
    borderRadius: 35
  },
  doctorDetailsView: {
    paddingLeft: 15,
    justifyContent: 'center'
  },
  doctorNameText: {
    color: Colors.DARK_BLUE,
    fontSize: 15,
    fontFamily: Fonts.MEDIUM,
    marginBottom: 3
  },
  doctorEmailAddressText: {
    color: Colors.DARK_BLUE,
    fontSize: 13,
    fontFamily: Fonts.LIGHT,
    marginBottom: 3
  },
  doctorLocationText: {
    color: Colors.GRAY,
    fontSize: 13,
    fontFamily: Fonts.LIGHT,
    marginBottom: 3
  },
  doctorStarsView: {
    flexDirection: 'row'
  }
})