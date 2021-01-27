import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar, Text, Image, SectionList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import Actions from '../Constants/Actions';
import Icon from 'react-native-ionicons';

class MyAccountScreen extends Component {
  static navigationOptions = {
    title: 'My Account'
  };

  options = {
    'Sign in': { icon: 'log-in', visible: 'logged-out', action: () => { this.props.navigation.navigate('SignInScreen'); } },
    'Sign up': { icon: 'clipboard', visible: 'logged-out', action: () => { this.props.navigation.navigate('SignUpScreen'); } },
    'Edit Account': { icon: 'contact', visible: 'signed-in', action: () => { this.props.navigation.navigate('EditAccountScreen'); } },
    'Terms of use': { icon: 'information-circle', visible: 'always', action: () => {  } },
    'Privacy Policy': { icon: 'eye-off', visible: 'always', action: () => {  } },
    'Give app feedback': { icon: 'ribbon', visible: 'always', action: () => {  } },
    'Share this app': { icon: 'share', visible: 'always', action: () => {  } },
    'Log out': { icon: 'log-out', visible: 'signed-in', action: () => { this.signOut(); } }
  };

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView />
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
        <SectionList
          style={styles.optionsList}
          keyExtractor={(item, index) => index}
          sections={[{ data: Object.keys(this.options) }]}
          renderItem={({item}) =>
            this.options[item].visible == 'always' || 
            (this.options[item].visible == 'signed-in' && (this.props.patient != null || this.props.doctor != null)) ||
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