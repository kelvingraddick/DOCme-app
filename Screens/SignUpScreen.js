import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, ScrollView, StyleSheet, View, StatusBar, Text, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import { RNS3 } from 'react-native-s3-upload';
import { AWS_ACCESS_KEY_ID, AWS_ACCESS_KEY_SECRET } from 'react-native-dotenv';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import Actions from '../Constants/Actions';

class SignUpScreen extends Component {
  static navigationOptions = {
    title: 'Sign Up'
  };

  state = {
    firstName: null,
    lastName: null,
    emailAddress: null,
    password: null,
    passwordConfirm: null,
    image: null,
    errorMessage: null,
    isLoading: false
  };

  render() {
    return (
      <>
        <StatusBar barStyle='dark-content' />
        <SafeAreaView />
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.titleText}>Welcome to DOCme!</Text>
              <Text style={styles.subTitleText}>Sign up to manage your account and appointments.</Text>
              <TextInput
                style={styles.textBox}
                placeholder='First Name'
                placeholderTextColor={Colors.MEDIUM_BLUE}
                value={this.state.firstName}
                onChangeText={text => this.setState({firstName: text})}
              />
              <TextInput
                style={styles.textBox}
                placeholder='Last Name'
                placeholderTextColor={Colors.MEDIUM_BLUE}
                value={this.state.lastName}
                onChangeText={text => this.setState({lastName: text})}
              />
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
              <TextInput
                style={styles.textBox}
                placeholder='Confirm password'
                placeholderTextColor={Colors.MEDIUM_BLUE}
                autoCompleteType='password'
                autoCapitalize='none'
                value={this.state.passwordConfirm}
                onChangeText={text => this.setState({passwordConfirm: text})}
              />
              <TouchableOpacity
                style={styles.textBox}
                onPress={() => this.onChooseImage()}
                underlayColor='#fff'>
                {!this.state.image && (
                  <Text style={styles.textBoxText}>Choose an account image</Text>
                )}
                {this.state.image && (
                  <Image
                    source={{ uri: this.state.image.uri }}
                    style={styles.image}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.onSignUpButtonTapped()}
                disabled={this.state.isLoading}
                underlayColor='#fff'>
                {!this.state.isLoading && (
                  <Text style={styles.buttonText}>Sign in with email</Text>
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

  async onChooseImage() {
    const options = {
      mediaType: 'photo',
      noData: true
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.uri) {
        var image = response;
        var file = {
          name: 'patient.' + Date.now() + '.' + Math.round(Math.random() * 1E9) + '.' + (/(?:\.([^.]+))?$/).exec(image.uri)[1],
          type: image.type,
          uri: image.uri
        };
        var options = {
          keyPrefix: 'images/patient/',
          bucket: 'wavelink-docme',
          region: 'us-east-1',
          accessKey: AWS_ACCESS_KEY_ID,
          secretKey: AWS_ACCESS_KEY_SECRET,
          successActionStatus: 201
        };
        this.setState({ isLoading: true });
        RNS3.put(file, options).then(response => {
          if (response.status === 201) {
            image.url = response.body.postResponse.location;
            this.setState({ image: image });
          } else {
            console.error('Failed to upload image to S3');
          }
          this.setState({ isLoading: false });
        });
      }
    });
  }

  async onSignUpButtonTapped() {
    this.setState({ isLoading: true });

    await this.validate();
    if (this.state.errorMessage) {
      this.setState({ isLoading: false });
      return;
    }

    var response = await this.signUp();
    if (response) {
      if (response.isSuccess) {
        this.props.dispatch({ type: Actions.SET_TOKEN, token: response.token });
        this.props.dispatch({ type: Actions.SET_PATIENT, patient: response.patient });
        await AsyncStorage.setItem('TOKEN', response.token);
        this.props.navigation.goBack();
      } else {
        await this.setState({ errorMessage: response.errorMessage });
        this.setState({ isLoading: false });
      }
    } else {
      Alert.alert(
        "There was an error signing up",
        "Please update entries and try again",
        [{ text: "OK" }],
        { cancelable: false }
      );
      this.setState({ isLoading: false });
    }
  }

  async validate() {
    var errorMessage = null;
    var emailAddressRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!this.state.firstName || this.state.firstName.length <= 2 || this.state.firstName.length >= 30) {
      errorMessage = 'First name must be between 2 and 30 characters.';
    } else if (!this.state.lastName || this.state.lastName.length <= 2 || this.state.lastName.length >= 30) {
      errorMessage = 'Last name must be between 2 and 30 characters.';
    } else if (!emailAddressRegex.test(this.state.emailAddress)) {
      errorMessage = 'Valid email address is required.';
    } else if (!this.state.password || this.state.password.length <= 7) {
      errorMessage = 'Password must be greater than 7 characters.';
    } else if (this.state.password != this.state.passwordConfirm) {
      errorMessage = 'Password confirmation must match.';
    }
    await this.setState({ errorMessage: errorMessage });
  }

  async signUp() {
    var body = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      emailAddress: this.state.emailAddress,
      password: this.state.password,
      imageUrl: this.state.image && this.state.image.url
    };
    return fetch('http://www.docmeapp.com/patient/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
  textBoxText: {
    color: Colors.WHITE,
    fontSize: 15
  },
  image: {
    height: 100,
    width: 100
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

export default connect(mapStateToProps)(SignUpScreen);