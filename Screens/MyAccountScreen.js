import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, Text, Image, SectionList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import OneSignal from 'react-native-onesignal';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import Actions from '../Constants/Actions';
import Icon from 'react-native-ionicons';

class MyAccountScreen extends Component {
  static navigationOptions = {
    title: 'My Account'
  };

  state = {
    errorMessage: null,
    errorAction: null
  };

  options = {
    'Sign in': { icon: 'log-in', visible: 'logged-out', action: () => { this.props.navigation.navigate('SignInScreen'); } },
    'Sign up': { icon: 'clipboard', visible: 'logged-out', action: () => { this.props.navigation.navigate('SignUpScreen'); } },
    'Edit Account': { icon: 'contact', visible: 'signed-in', action: () => { this.props.navigation.navigate('EditAccountScreen'); } },
    'Change Password': { icon: 'lock', visible: 'signed-in', action: () => { this.props.navigation.navigate('ChangePasswordScreen'); } },
    'Edit Practice': { icon: 'business', visible: 'signed-in-doctor', action: () => { this.props.navigation.navigate('EditPracticeScreen'); } },
    'Edit Schedule': { icon: 'calendar', visible: 'signed-in-doctor', action: () => { this.props.navigation.navigate('EditScheduleScreen'); } },
    'Terms of use': { icon: 'information-circle', visible: 'always', action: () => { this.props.navigation.navigate('WebViewScreen', { title: 'Terms of use', url: 'http://app.docmeapp.com/termsofuse/' }); } },
    'Privacy Policy': { icon: 'eye-off', visible: 'always', action: () => { this.props.navigation.navigate('WebViewScreen', { title: 'Privacy Policy', url: 'http://app.docmeapp.com/privacypolicy/' }); } },
    'Give app feedback': { icon: 'ribbon', visible: 'always', action: () => {  } },
    'Share this app': { icon: 'share', visible: 'always', action: () => {  } },
    'Log out': { icon: 'log-out', visible: 'signed-in', action: () => { this.signOut(); } }
  };

  async componentDidMount() {
    this.setErrorMessage();
  }

  async componentDidUpdate(newProps) {
    if (newProps.patient !== this.props.patient ||
        newProps.doctor !== this.props.doctor ||
        newProps.token !== this.props.token) {
      this.setErrorMessage();
    }
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        { this.props.patient &&
          <View style={styles.headerView}>
            <Text style={styles.nameText}>{this.props.patient.firstName} {this.props.patient.lastName}</Text>
            <Text style={styles.emailAddressText}>{this.props.patient.emailAddress}</Text>
            {this.props.patient.imageUrl && (
              <Image
                source={{ uri: this.props.patient.imageUrl ? this.props.patient.imageUrl : '' }}
                style={styles.image}
              />
            )}
          </View>
        }
        { this.props.doctor &&
          <View style={styles.headerView}>
            <Text style={styles.nameText}>{this.props.doctor.firstName} {this.props.doctor.lastName}</Text>
            <Text style={styles.emailAddressText}>{this.props.doctor.emailAddress}</Text>
            {this.props.doctor.imageUrl && (
              <Image
                source={{ uri: this.props.doctor.imageUrl ? this.props.doctor.imageUrl : '' }}
                style={styles.image}
              />
            )}
          </View>
        }
        { this.state.errorMessage &&
          <TouchableOpacity style={styles.errorView} onPress={this.state.errorAction}>
            <Icon style={styles.errorIcon} name='alert' />
            <Text style={styles.errorText}>{this.state.errorMessage}</Text>
          </TouchableOpacity>
        }
        <SectionList
          style={styles.optionsList}
          keyExtractor={(item, index) => index}
          sections={[{ data: Object.keys(this.options) }]}
          renderItem={({item}) =>
            this.options[item].visible == 'always' || 
            (this.options[item].visible == 'signed-in' && (this.props.patient != null || this.props.doctor != null)) ||
            (this.options[item].visible == 'signed-in-doctor' && this.props.patient == null && this.props.doctor != null) ||
            (this.options[item].visible == 'logged-out' && (this.props.patient == null && this.props.doctor == null)) ? 
              (
                <TouchableOpacity style={styles.optionView} onPress={this.options[item].action}>
                  <Icon style={styles.optionIcon} name={this.options[item].icon} />
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              ) :
              null
          }
          ListHeaderComponent={(<View style={styles.optionsListHeader}></View>)}
        />
      </>
    );
  }

  async signOut() {
    this.props.dispatch({ type: Actions.SET_TOKEN, token: null });
    this.props.dispatch({ type: Actions.SET_PATIENT, patient: null });
    this.props.dispatch({ type: Actions.SET_DOCTOR, doctor: null });
    await AsyncStorage.removeItem('TOKEN');
    OneSignal.removeExternalUserId((results) => {
      console.log('OneSignal: Results of removing external user id: ' + JSON.stringify(results));
      if (results.push && results.push.success) {
        console.log('OneSignal: Results of removing external user id push status: ' + results.push.success);
      }
    });
  }

  setErrorMessage() {
    if (this.props.doctor != null && !['trialing', 'active'].includes(this.props.doctor.stripeSubscriptionStatus || '')) {
      this.setState({ errorMessage: 'Doctor subscription inactive. Tap to add payment!' });
      this.setState({ errorAction: () => this.props.navigation.navigate('CheckoutScreen') });
    } else {
      this.setState({ errorMessage: null });
      this.setState({ errorAction: null });
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: Colors.LIGHT_GRAY
  },
  headerView: {
    alignItems: 'center',
    padding: 20
  },
  nameText: {
    color: Colors.DARK_BLUE,
    fontSize: 20,
    fontFamily: Fonts.MEDIUM,
    marginBottom: 5
  },
  emailAddressText: {
    color: Colors.DARK_BLUE,
    fontSize: 15,
    fontFamily: Fonts.LIGHT,
    marginBottom: 5
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 10
  },
  errorView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.RED
  },
  errorIcon: {
    marginRight: 5,
    fontSize: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: Colors.WHITE
  },
  errorText: {
    color: Colors.WHITE,
    fontSize: 15,
    fontFamily: Fonts.LIGHT
  },
  optionsList: {
    backgroundColor: Colors.LIGHT_GRAY
  },
  optionsListHeader: {
    height: 15
  },
  optionView: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: Colors.WHITE,
    borderBottomColor: Colors.LIGHT_GRAY,
    borderBottomWidth: 1
  },
  optionIcon: {
    width: 50,
    fontSize: 25,
    lineHeight: 55,
    textAlign: 'center',
    color: Colors.DARK_BLUE
  },
  optionText: {
    color: Colors.DARK_GRAY,
    fontSize: 17,
    lineHeight: 55,
    fontFamily: Fonts.MEDIUM
  }
})

const mapStateToProps = (state) => {
  var { token, patient, doctor } = state;
  return { token, patient, doctor };
};

export default connect(mapStateToProps)(MyAccountScreen);