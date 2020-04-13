import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SafeAreaView, StyleSheet, View, StatusBar, ActivityIndicator } from 'react-native';
import Actions from '../Constants/Actions';

const setPatient = patient => (
  {
    type: Actions.SET_PATIENT,
    patient: patient
  }
);

const setDoctor = doctor => (
  {
    type: Actions.SET_DOCTOR,
    doctor: doctor
  }
);

class LoadingScreen extends Component {
  async componentDidMount() {
    var patient = await this.signIn('kelvingraddick@gmail.com', 'password');
    if (patient) {
      this.props.setPatient(patient);
      console.info(this.props.patient);
    }
    this.props.navigation.navigate('BottomTabNavigator');
  }
  
  render() {
    return (
      <>
        <SafeAreaView />
        <View style={styles.container}>  
          <ActivityIndicator size="large" color="gray" />
        </View> 
      </>
    );
  }

  async signIn(emailAddress, password) {
    var body = {
      identityType: 'docme',
      userType: 'patient',
      emailAddress: emailAddress,
      password: password
    };
    return fetch('http://www.docmeapp.com/patient/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    .then((response) => { 
      if (response.status == 200) {
        return response.json()
        .then((responseJson) => {
          if (responseJson.isSuccess) {
            return responseJson.patient;
          }
        })
      }
      return undefined;
    })
    .catch((error) => {
      console.error(error);
      return undefined;
    });
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row'
  }
})

const mapStateToProps = (state) => {
  var { patient, doctor } = state;
  return { patient, doctor };
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({ setPatient, setDoctor }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen);