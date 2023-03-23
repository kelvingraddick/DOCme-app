import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, View, StatusBar, Text, TextInput, Modal, TouchableOpacity, TouchableHighlight, Alert, Image, ActivityIndicator, FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import Actions from '../Constants/Actions';

class ChangePasswordScreen extends Component {
  static navigationOptions = {
    title: 'Change Password'
  };

  state = {
    currentPassword: null,
    newPassword: null,
    newPasswordConfirm: null,
    errorMessage: null,
    isLoading: false
  };

  render() {
    return (
      <>
        <StatusBar barStyle='dark-content' />
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.header}>
            <Text style={styles.subTitleText}>Change your password below.</Text>
              <TextInput
                style={styles.textBox}
                placeholder='Current Password'
                placeholderTextColor={Colors.MEDIUM_BLUE}
                autoComplete='password'
                autoCapitalize='none'
                value={this.state.currentPassword}
                onChangeText={text => this.setState({currentPassword: text})}
              />
              <TextInput
                style={styles.textBox}
                placeholder='Password'
                placeholderTextColor={Colors.MEDIUM_BLUE}
                autoComplete='password-new'
                autoCapitalize='none'
                value={this.state.newPassword}
                onChangeText={text => this.setState({newPassword: text})}
              />
              <TextInput
                style={styles.textBox}
                placeholder='Confirm password'
                placeholderTextColor={Colors.MEDIUM_BLUE}
                autoComplete='password-new'
                autoCapitalize='none'
                value={this.state.newPasswordConfirm}
                onChangeText={text => this.setState({newPasswordConfirm: text})}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.onSaveButtonTapped()}
                disabled={this.state.isLoading}
                underlayColor='#fff'>
                {!this.state.isLoading && (
                  <Text style={styles.buttonText}>Save</Text>
                )}
                {this.state.isLoading && (
                  <ActivityIndicator size="small" color="#ffffff" />
                )}
              </TouchableOpacity>
              {this.state.errorMessage && (
                <Text style={styles.errorText}>{this.state.errorMessage}</Text>
              )}
            </View>
          </View>
        </ScrollView>
      </>
    );
  }

  async onSaveButtonTapped() {
    this.setState({ isLoading: true });

    await this.validate();
    if (this.state.errorMessage) {
      this.setState({ isLoading: false });
      return;
    }

    var response = await this.save();
    if (response) {
      if (response.isSuccess) {
        this.props.dispatch({ type: Actions.SET_PATIENT, patient: response.patient || null });
        this.props.dispatch({ type: Actions.SET_DOCTOR, doctor: response.doctor  || null });
        this.props.navigation.goBack();
      } else {
        await this.setState({ errorMessage: response.errorMessage });
        this.setState({ isLoading: false });
      }
    } else {
      Alert.alert(
        "There was an error changing the password",
        "Please update entries and try again",
        [{ text: "OK" }],
        { cancelable: false }
      );
      this.setState({ isLoading: false });
    }
  }

  async validate() {
    var errorMessage = null;
    if (!this.state.currentPassword || this.state.currentPassword.length <= 0) {
      errorMessage = 'Current password is required.';
    } else if (!this.state.newPassword || this.state.newPassword.length <= 7) {
      errorMessage = 'New password must be greater than 7 characters.';
    } else if (this.state.newPassword != this.state.newPasswordConfirm) {
      errorMessage = 'Password confirmation must match.';
    }
    await this.setState({ errorMessage: errorMessage });
  }

  async save() {
    var url = 'http://www.docmeapp.com';
    if (this.props.patient) {
      var patient = this.props.patient;
      url += '/patient/' + patient.id + '/update/password';
    } else if (this.props.doctor) {
      var doctor = this.props.doctor;
      url += '/doctor/' + doctor.id + '/update/password';
    }
    var body = {
      currentPassword: this.state.currentPassword,
      newPassword: this.state.newPassword
    };
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.token
      },
      body: JSON.stringify(body)
    })
    .then((response) => { 
      if (response.status == 200) {
        return response.json()
        .then((responseJson) => {
          return responseJson;
        })
      } else {
        return undefined;
      }
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
  textBoxText: {
    color: Colors.WHITE,
    fontSize: 15
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
  },
  errorText: {
    color: Colors.WHITE,
    fontSize: 15,
    fontFamily: Fonts.MEDIUM,
    marginBottom: 30
  }
})

const mapStateToProps = (state) => {
  var { token, patient, doctor } = state;
  return { token, patient, doctor };
};

export default connect(mapStateToProps)(ChangePasswordScreen);