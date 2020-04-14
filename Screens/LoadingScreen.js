import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, StyleSheet, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Actions from '../Constants/Actions';

class LoadingScreen extends Component {
  async componentDidMount() {
    var token = await AsyncStorage.getItem('TOKEN');
    if (token) { 
      this.props.dispatch({ type: Actions.SET_TOKEN, token: token });
      var response = await this.signIn(token);
      if (response) {
        this.props.dispatch({ type: Actions.SET_PATIENT, patient: response.patient });
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

  async signIn(token) {
    return fetch('http://www.docmeapp.com/patient/authorize', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token }
    })
    .then((response) => { 
      if (response.status == 200) {
        return response.json()
        .then((responseJson) => {
          if (responseJson.isSuccess) {
            return responseJson;
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
  var { token, patient, doctor } = state;
  return { token, patient, doctor };
};

export default connect(mapStateToProps)(LoadingScreen);