import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Moment from 'moment';
import Actions from '../Constants/Actions';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';

class DoctorRatingsScreen extends Component {
  static navigationOptions = {
    title: 'Doctor Ratings'
  };

  state = {
    ratings: []
  };

  async componentDidMount() {
    await this.getRatings();
  }
  
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          { ratings.length > 0 &&
            <View>
              <DoctorRowView doctor={ratings[0].doctor} />
            </View>
          }
          { ratings.length > 0 &&
            <FlatList
                data={ratings}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => 
                  <View style={styles.doctorView}> 
                    <Image
                      style={styles.doctorImage}
                      source={{uri: item.doctor.imageUrl ? item.doctor.imageUrl : ''}}
                    />
                    <View style={styles.doctorDetailsView}>  
                      <Text style={styles.doctorNameText}>{item.doctor.firstName} {item.doctor.lastName}</Text>
                      { item.doctor.practice &&
                        <Text style={styles.doctorLocationText}>{item.doctor.practice.addressLine1} {item.doctor.practice.addressLine2} {item.doctor.practice.city}, {item.doctor.practice.state} {item.doctor.practice.postalCode}</Text>
                      }
                      <Text style={styles.doctorEmailAddressText}>{Moment(item.timestamp).isBefore(Moment()) ? '(Past)' : '' } {Moment(item.timestamp).format('dddd, MMMM Do') + ', ' + Moment(item.timestamp).format('h:mma')}</Text>
                      <Text style={styles.doctorEmailAddressText}>{item.specialty.name}</Text>
                    </View>
                  </View>
                }
              />
          }
        </View>
      </>
    );
  }

  async getRatings() {
    var ratings = await fetch('http://www.docmeapp.com/rating/doctor/' + this.props.doctor.id + '/list/', { method: 'GET' })
    .then((response) => { 
      if (response.status == 200) {
        return response.json()
        .then((responseJson) => {
          if (responseJson.isSuccess) {
            return responseJson.ratings;
          }
        })
      }
      return [];
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
    this.setState({ratings: ratings});
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    backgroundColor: Colors.LIGHT_GRAY
  },
  backgroundImage: {
    resizeMode: "cover",
    height: 400,
    width: null
  },
  titleText: {
    color: Colors.DARK_GRAY,
    fontSize: 17,
    lineHeight: 55,
    fontFamily: Fonts.MEDIUM,
    textAlign: 'center'
  },
  button: {
    color: Colors.WHITE,
    fontSize: 15,
    padding: 17,
    backgroundColor: Colors.DARK_BLUE,
    borderRadius: 5,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 20,
    fontFamily: Fonts.MEDIUM,
    textAlign: 'center'
  },
  doctorView: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: Colors.WHITE
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
  }
})

const mapStateToProps = (state) => {
  var { token, patient, doctor, appointments } = state;
  return { token, patient, doctor, appointments };
};

export default connect(mapStateToProps)(DoctorRatingsScreen);