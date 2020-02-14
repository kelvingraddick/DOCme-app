import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar, FlatList, Image, Text } from 'react-native';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';

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
    paddingLeft: 15
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
    fontFamily: Fonts.NORMAL
  }
})