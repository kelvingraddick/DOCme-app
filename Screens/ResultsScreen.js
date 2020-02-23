import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar, FlatList, Image, Text } from 'react-native';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import Icon from 'react-native-ionicons';

export default class ResultsScreen extends Component {
  state = {
    doctors: []
  };
  
  async componentDidMount() {
    var doctors = await fetch('http://www.docmeapp.com/doctor/search', { method: 'GET' })
    .then((response) => { 
      if (response.status == 200) {
        return response.json()
        .then((responseJson) => {
          if (responseJson.isSuccess) {
            return responseJson.doctors;
          }
        })
      }
      return undefined;
    })
    .catch((error) => {
      console.error(error);
      return undefined;
    });
    this.setState({doctors: doctors});
  }
  
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView />
        <View style={styles.container}>  
          <FlatList
            data={this.state.doctors}
            renderItem={({item}) => 
              <View style={styles.doctorView}> 
                <Image
                  style={styles.doctorImage}
                  source={{uri: item.imageUrl ? item.imageUrl : ''}}
                />
                <View style={styles.doctorDetailsView}>  
                  <Text style={styles.doctorNameText}>{item.firstName} {item.lastName}</Text>
                  <Text style={styles.doctorEmailAddressText}>{item.emailAddress}</Text>
                  { item.practice &&
                    <Text style={styles.doctorLocationText}>{item.practice.addressLine1} {item.practice.addressLine2} {item.practice.city}, {item.practice.state} {item.practice.postalCode}</Text>
                  }
                  <View style={styles.doctorStarsView}>  
                    <Icon style={styles.doctorStarIcon} name="star" />
                    <Icon style={styles.doctorStarIcon} name="star" />
                    <Icon style={styles.doctorStarIcon} name="star" />
                    <Icon style={styles.doctorStarIcon} name="star" />
                    <Icon style={styles.doctorStarIcon} name="star" />
                    <Text style={styles.doctorStarText}>(471)</Text>
                  </View>
                </View>
              </View>
            }
          />
        </View>
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  },
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
  doctorStarIcon: {
    color: Colors.GREEN,
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