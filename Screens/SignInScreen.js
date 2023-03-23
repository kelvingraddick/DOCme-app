import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, View, StatusBar, Text, TextInput, TouchableOpacity, TouchableHighlight, Alert, Modal, FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Login from '../Helpers/Login';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import Actions from '../Constants/Actions';
import ModelHeader from '../Components/ModalHeader';
import CustomSafeAreaView from '../Components/CustomSafeAreaView';
import UserTypes from '../Constants/UserTypes';

class SignInScreen extends Component {
  static navigationOptions = {
    title: 'Sign In'
  };

  state = {
    isUserTypeSelectModalVisible: false,
    selectedUserTypeOption: {},
    emailAddress: null,
    password: null
  };

  render() {
    return (
      <>
        <StatusBar barStyle='dark-content' />
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.titleText}>Welcome back to DOCme!</Text>
              <Text style={styles.subTitleText}>Sign in to manage your account and appointments.</Text>
              <TextInput
                style={styles.textBox}
                placeholder='Patient or doctor?'
                placeholderTextColor={Colors.MEDIUM_BLUE}
                value={this.state.selectedUserTypeOption.name}
                onFocus={() => this.setState({isUserTypeSelectModalVisible: true})}
              />
              <TextInput
                style={styles.textBox}
                placeholder='Email Address'
                placeholderTextColor={Colors.MEDIUM_BLUE}
                autoComplete='email'
                autoCapitalize='none'
                value={this.state.emailAddress}
                onChangeText={text => this.setState({emailAddress: text})}
              />
              <TextInput
                style={styles.textBox}
                placeholder='Password'
                placeholderTextColor={Colors.MEDIUM_BLUE}
                autoComplete='password'
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
              <TouchableOpacity
                style={styles.link}
                onPress={() => this.props.navigation.navigate('ForgotPasswordScreen')}
                underlayColor='#fff'>
                <Text style={styles.linkText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.isUserTypeSelectModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <CustomSafeAreaView>
              <ModelHeader titleText="Select" onCancelButtonPress={() => this.setState({isUserTypeSelectModalVisible: false})} />
              <FlatList
                data={UserTypes}
                keyExtractor={item => item.id}
                renderItem={({item, index, separators}) => (
                  <TouchableHighlight
                    style={styles.option}
                    onPress={() => this.onUserTypeOptionSelected(item)}
                    onShowUnderlay={separators.highlight}
                    onHideUnderlay={separators.unhighlight}>
                    <Text style={styles.optionText}>{item.name}</Text>
                  </TouchableHighlight>
                )}
                ItemSeparatorComponent={({highlighted}) => (<View style={styles.optionSeparator} />)}
              />
            </CustomSafeAreaView>
          </Modal>
        </ScrollView>
      </>
    );
  }

  onUserTypeOptionSelected(option) {
    this.setState({selectedUserTypeOption: option});
    this.setState({isUserTypeSelectModalVisible: false});
  }

  async onSignInButtonTapped() {
    var response = await Login.withEmailAddressAndPassword(this.state.selectedUserTypeOption.id, this.state.emailAddress, this.state.password);
    if (response) {
      this.props.dispatch({ type: Actions.SET_TOKEN, token: response.token });
      this.props.dispatch({ type: Actions.SET_PATIENT, patient: response.patient || null });
      this.props.dispatch({ type: Actions.SET_DOCTOR, doctor: response.doctor || null });
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
  },
  link: {
    paddingBottom: 20
  },
  linkText: {
    color: Colors.DARK_BLUE,
    fontSize: 15,
    fontFamily: Fonts.MEDIUM,
    textDecorationLine: 'underline'
  },
  // TODO: refactor out modal
  option: {
    height: 55,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  optionText: {
    padding: 10,
    color: Colors.DARK_BLUE,
    fontSize: 15,
    fontFamily: Fonts.NORMAL
  },
  optionSeparator: {
    height: 1,
    backgroundColor: Colors.LIGHT_GRAY
  }
})

const mapStateToProps = (state) => {
  var { token, patient, doctor } = state;
  return { token, patient, doctor };
};

export default connect(mapStateToProps)(SignInScreen);