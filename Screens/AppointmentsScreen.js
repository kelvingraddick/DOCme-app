import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Moment from 'moment';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';

class AppointmentsScreen extends Component {
  static navigationOptions = {
    title: 'Appointments'
  };
  
  state = {
    appointments: []
  };

  async componentDidMount() {
    await this.getAppointments();
  }
  
  async componentDidUpdate() {
    await this.getAppointments();
  }
  
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView />
        <View style={styles.container}>
          { (!this.props.patient || this.state.appointments.length == 0) &&
            <View>
              <Image style={styles.backgroundImage} source={require('../Images/background-2.jpg')} />
              <Text style={styles.titleText}>Search for a doctor to set an appointment</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.props.navigation.navigate('SearchScreenStackNavigator')}
                underlayColor='#fff'>
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
              { !this.props.patient &&
                <>
                  <Text style={styles.titleText}>..or sign in/up to see your appointments</Text>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.props.navigation.navigate('MyAccountScreenStackNavigator')}
                    underlayColor='#fff'>
                    <Text style={styles.buttonText}>Sign In or Sign Up</Text>
                  </TouchableOpacity>
                </>
              }
            </View>
          }
          { this.props.patient && this.state.appointments.length > 0 &&
            <FlatList
                data={this.state.appointments}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => 
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('EditAppointmentScreen', { id: item.id })}>
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
                        <Text style={styles.doctorEmailAddressText}>{Moment(item.timestamp).format('dddd, MMMM Do') + ', ' + Moment(item.timestamp).format('h:mma')}</Text>
                        <Text style={styles.doctorEmailAddressText}>{item.specialty.name}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                }
              />
          }
        </View>
      </>
    );
  }

  async getAppointments() {
    if (!this.props.patient || !this.props.token) return;

    var appointments = await fetch('http://www.docmeapp.com/appointment/patient/' + this.props.patient.id + '/list', { 
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + this.props.token }
    })
    .then((response) => { 
      if (response.status == 200) {
        return response.json()
        .then((responseJson) => {
          if (responseJson.isSuccess) {
            return responseJson.appointments;
          }
        })
      }
      return undefined;
    })
    .catch((error) => {
      console.error(error);
      return undefined;
    });
    this.setState({appointments: appointments});
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
  var { token, patient, doctor } = state;
  return { token, patient, doctor };
};

export default connect(mapStateToProps)(AppointmentsScreen);