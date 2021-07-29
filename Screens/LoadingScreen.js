import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, StyleSheet, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Actions from '../Constants/Actions';
import Login from '../Helpers/Login';

class LoadingScreen extends Component {
  async componentDidMount() {
    var token = await AsyncStorage.getItem('TOKEN');
    if (token) { 
      this.props.dispatch({ type: Actions.SET_TOKEN, token: token });
      var response = await Login.withToken('patient', token);
      if (response?.patient) {
        await this.props.dispatch({ type: Actions.SET_PATIENT, patient: response.patient || null });
      } else {
        var response = await Login.withToken('doctor', token);
        if (response?.doctor) {
          await this.props.dispatch({ type: Actions.SET_DOCTOR, doctor: response.doctor || null });
        }
      }
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
  var { token, patient, doctor } = state;
  return { token, patient, doctor };
};

export default connect(mapStateToProps)(LoadingScreen);