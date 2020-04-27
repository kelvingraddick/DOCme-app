import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, ScrollView, StyleSheet, View, StatusBar, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import Actions from '../Constants/Actions';

class SignInScreen extends Component {
  static navigationOptions = {
    title: 'Sign In'
  };

  state = {
    emailAddress: null,
    password: null
  };

  render() {
    return (
      <>
        <StatusBar barStyle='dark-content' />
        <SafeAreaView />
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.titleText}>Welcome back to DOCme!</Text>
              <Text style={styles.subTitleText}>Sign in to manage your account and appointments.</Text>
              <TextInput
                style={styles.textBox}
                placeholder='Email Address'
                placeholderTextColor={Colors.MEDIUM_BLUE}
                autoCompleteType='email'
                autoCapitalize='none'
                value={this.state.emailAddress}
                onChangeText={text => this.setState({emailAddress: text})}
              />
              <TextInput
                style={styles.textBox}
                placeholder='Password'
                placeholderTextColor={Colors.MEDIUM_BLUE}
                autoCompleteType='password'
                autoCapitalize='none'
                value={this.state.password}
                onChangeText={text => this.setState({password: text})}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.onSignInButtonTapped()}
                underlayColor='#fff'
                disabled={!this.state.emailAddress || !this.state.password}>
                <Text style={styles.buttonText}>Sign in with email</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </>
    );
  }

  async onSignInButtonTapped() {
    var response = await this.signIn(this.state.emailAddress, this.state.password);
    if (response) {
      this.props.dispatch({ type: Actions.SET_TOKEN, token: response.token });
      this.props.dispatch({ type: Actions.SET_PATIENT, patient: response.patient });
      await AsyncStorage.setItem('TOKEN', response.token);
      this.props.navigation.goBack();
    } else {
      Alert.alert(
        "There was an error signing in",
        "Please update credentials and try again",
        [{ text: "OK" }],
        { cancelable: false }
      );
    }
  }

  async signIn(emailAddress, password) {
    var body = {
      identityType: 'docme',
      userType: 'patient',
      emailAddress: emailAddress,
      password: password
    };
    return fetch('http://www.docmeapp.com/patient/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
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
    backgroundColor: Colors.LIGHT_GRAY
  },
  header: {
    alignContent: 'center',
    padding: 20,
    backgroundColor: Colors.LIGHT_BLUE
  },
  titleText: {
    color: Colors.WHITE,
    fontSize: 20,
    fontFamily: Fonts.MEDIUM,
    marginTop: 15,
    marginBottom: 5
  },
  subTitleText: {
    color: Colors.DARK_BLUE,
    fontSize: 15,
    fontFamily: Fonts.MEDIUM,
    marginBottom: 30
  },
  textBox: {
    color: Colors.WHITE,
    fontSize: 15,
    padding: 20,
    backgroundColor: Colors.HIGH_LIGHT,
    borderRadius: 5,
    marginBottom: 10
  },
  button: {
    color: Colors.WHITE,
    fontSize: 15,
    padding: 17,
    backgroundColor: Colors.DARK_BLUE,
    borderRadius: 5,
    marginBottom: 20
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 20,
    fontFamily: Fonts.MEDIUM,
    textAlign: 'center'
  }
})

const mapStateToProps = (state) => {
  var { token, patient, doctor } = state;
  return { token, patient, doctor };
};

export default connect(mapStateToProps)(SignInScreen);