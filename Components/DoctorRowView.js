import React, { Component } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import Icon from 'react-native-ionicons';

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
            {
              [1, 2, 3, 4, 5].map((rating) => {
                  let style = this.props.doctor.averageRating && this.props.doctor.averageRating >= rating ? styles.doctorGreenStarIcon : styles.doctorGrayStarIcon;
                  return <Icon style={style} name="star" />
                }
              )
            } 
            <Text style={styles.doctorStarText}>({this.props.doctor.numberOfRatings})</Text>
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
  },
  doctorGreenStarIcon: {
    color: Colors.GREEN,
    fontSize: 20,
    marginRight: 2
  },
  doctorGrayStarIcon: {
    color: Colors.LIGHT_GRAY,
    fontSize: 20,
    marginRight: 2
  },
  doctorStarText: {
    color: Colors.GRAY,
    fontSize: 13,
    fontFamily: Fonts.NORMAL,
    lineHeight: 20
  }
})