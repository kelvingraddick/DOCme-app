import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, Text, Image, SectionList, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
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
    isLoading: false
  };

  options = {
    'Sign in': { icon: 'log-in', visible: 'logged-out', action: () => { this.props.navigation.navigate('SignInScreen'); } },
    'Sign up': { icon: 'clipboard', visible: 'logged-out', action: () => { this.props.navigation.navigate('SignUpScreen'); } },
    'Edit Account': { icon: 'contact', visible: 'signed-in', action: () => { this.props.navigation.navigate('EditAccountScreen'); } },
    'Change Password': { icon: 'lock', visible: 'signed-in', action: () => { this.props.navigation.navigate('ChangePasswordScreen'); } },
    'Edit Practice': { icon: 'business', visible: 'signed-in-doctor', action: () => { this.props.navigation.navigate('EditPracticeScreen'); } },
    'Edit Schedule': { icon: 'calendar', visible: 'signed-in-doctor', action: () => { this.props.navigation.navigate('EditScheduleScreen'); } },
    'Edit Specialties': { icon: 'ribbon', visible: 'signed-in-doctor', action: () => { this.props.navigation.navigate('EditSpecialtiesScreen'); } },
    'Terms of use': { icon: 'information-circle', visible: 'always', action: () => { this.props.navigation.navigate('WebViewScreen', { title: 'Terms of use', url: 'http://app.docmeapp.com/termsofuse/' }); } },
    'Privacy Policy': { icon: 'eye-off', visible: 'always', action: () => { this.props.navigation.navigate('WebViewScreen', { title: 'Privacy Policy', url: 'http://app.docmeapp.com/privacypolicy/' }); } },
    'Give app feedback': { icon: 'ribbon', visible: 'always', action: () => { Linking.openURL('mailto:faguebor@gmail.com?subject=DOCme%20-%20Give%20app%20feedback%21&body=Please%20share%20your%20feedback%20-%20be%20sure%20to%20include%20your%20account%20info%2C%20screenshots%2C%20and%2For%20any%20other%20information%20that%20could%20be%20useful.'); } },
    'Share this app': { icon: 'share', visible: 'always', action: () => {  } },
    'Log out': { icon: 'log-out', visible: 'signed-in', action: () => { this.signOut(); } }
  };

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
        { !this.state.isLoading && (this.props.doctor != null && !['trialing', 'active'].includes(this.props.doctor.stripeSubscriptionStatus || '')) &&
          <TouchableOpacity style={styles.errorView} onPress={() => this.props.navigation.navigate('CheckoutScreen')}>
            <Icon style={styles.errorIcon} name='card' />
            <Text style={styles.errorText}>Doctor <Text style={{fontWeight: "bold"}}>subscription</Text> inactive! Tap to <Text style={{ textDecorationLine: "underline", fontStyle: "italic" }}>add payment</Text></Text>
          </TouchableOpacity>
        }
        { !this.state.isLoading && (this.props.doctor != null && ['trialing', 'active'].includes(this.props.doctor.stripeSubscriptionStatus || '')) &&
          <TouchableOpacity style={styles.subscriptionView} onPress={() => this.confirmCancelSubscription()}>
            <Text style={styles.subscriptionText}>Doctor subscription is <Text style={{fontWeight: "bold"}}>{this.props.doctor.stripeSubscriptionStatus}</Text> <Icon style={styles.subscriptionIcon} name='checkmark-circle' /> - </Text>
            <Text style={[styles.subscriptionText, { alignSelf: 'flex-end' }]}><Text style={{ textDecorationLine: "underline", fontStyle: "italic" }}>Cancel?</Text></Text>
          </TouchableOpacity>
        }
        { !this.state.isLoading && (this.props.doctor != null && !this.props.doctor.practice) &&
          <TouchableOpacity style={styles.errorView} onPress={this.options['Edit Practice'].action}>
            <Icon style={styles.errorIcon} name={this.options['Edit Practice'].icon} />
            <Text style={styles.errorText}>No <Text style={{fontWeight: "bold"}}>location</Text> entered! Tap to <Text style={{ textDecorationLine: "underline", fontStyle: "italic" }}>edit practice</Text></Text>
          </TouchableOpacity>
        }
        { !this.state.isLoading && (this.props.doctor != null && !this.props.doctor.schedule) &&
          <TouchableOpacity style={styles.errorView} onPress={this.options['Edit Schedule'].action}>
            <Icon style={styles.errorIcon} name={this.options['Edit Schedule'].icon} />
            <Text style={styles.errorText}>No <Text style={{fontWeight: "bold"}}>availability</Text> set! Tap to <Text style={{ textDecorationLine: "underline", fontStyle: "italic" }}>set schedule</Text></Text>
          </TouchableOpacity>
        }
        { !this.state.isLoading && (this.props.doctor != null && (!this.props.doctor.specialties || this.props.doctor.specialties.length === 0)) &&
          <TouchableOpacity style={styles.errorView} onPress={this.options['Edit Specialties'].action}>
            <Icon style={styles.errorIcon} name={this.options['Edit Specialties'].icon} />
            <Text style={styles.errorText}>No <Text style={{fontWeight: "bold"}}>specialties</Text> set! Tap to <Text style={{ textDecorationLine: "underline", fontStyle: "italic" }}>set specialties</Text></Text>
          </TouchableOpacity>
        }
        { this.state.isLoading &&
          <View style={styles.subscriptionView}>
            <ActivityIndicator size="small" color="#ffffff" />
          </View>
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

  async confirmCancelSubscription() {
    let that = this;
    Alert.alert(
      "Cancel doctor subscription?",
      "Your account won't show up for potential patients in this app anymore. Are you sure?",
      [
        {
          text: "No",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            that.setState({ isLoading: true });
            var response = await that.cancelSubscription();
            if (response && response.isSuccess) {
              Alert.alert(
                "Subscription cancelled.",
                "You can activate a new subscription at any time on the My Account tab.",
                [{ text: "OK" }],
                { cancelable: false }
              );
              that.props.dispatch({ type: Actions.SET_DOCTOR, doctor: response.doctor || null });
            } else {
              Alert.alert(
                "There was an error saving changes",
                (response && response.errorMessage) || "Please update entries and try again",
                [{ text: "OK" }],
                { cancelable: false }
              );
              that.setState({ isLoading: false });
            }
          }
        }
      ]
    );
  }

  async cancelSubscription() {
    return fetch('http://www.docmeapp.com/doctor/' + this.props.doctor.id + '/cancel/subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.token
      }
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
    marginTop: 1,
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
  subscriptionView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.GREEN
  },
  subscriptionIcon: {
    marginRight: 5,
    fontSize: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: Colors.WHITE
  },
  subscriptionText: {
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