import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';

class LogoTitle extends React.Component {
  render() {
    return (<Image style={styles.logoText} source={require('../Images/docme-logo-with-icon.png')} />);
  }
}

export default class SearchScreen extends Component {
  static navigationOptions = {
    headerTitle: () => <LogoTitle />
  };

  render() {
    return (
      <>
        <StatusBar barStyle='dark-content' />
        <SafeAreaView />
        <View style={styles.container}>
          <View style={styles.header}>
            <Image style={styles.logoIcon} source={require('../Images/docme-logo-icon-white.png')} />
            <Text style={styles.titleText}>Welcome to DOCme!{'\n'}Tell us what you need below</Text>
            <TextInput
              style={styles.textBox}
              placeholder='Illness'
              placeholderTextColor={Colors.MEDIUM_BLUE}
            />
            <TextInput
              style={styles.textBox}
              placeholder='Location'
              placeholderTextColor={Colors.MEDIUM_BLUE}
            />
            <TextInput
              style={styles.textBox}
              placeholder='Date'
              placeholderTextColor={Colors.MEDIUM_BLUE}
            />
            <TextInput
              style={styles.textBox}
              placeholder='Insurance'
              placeholderTextColor={Colors.MEDIUM_BLUE}
            />
            <TouchableOpacity
              style={styles.button}
              //onPress={() => navigate('HomeScreen')}
              underlayColor='#fff'>
              <Text style={styles.buttonText}>Find</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
};

const styles = StyleSheet.create({
  logoText: {
    height: 45,
    width: 100,
    marginTop: -11,
    resizeMode: 'contain'
  },
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY
  },
  header: {
    alignContent: 'center',
    padding: 20,
    backgroundColor: Colors.LIGHT_BLUE
  },
  logoIcon: {
    height: 60,
    width: 60,
    alignSelf: 'center',
    tintColor: Colors.WHITE,
    marginTop: 10,
    marginBottom: 10
  },
  titleText: {
    color: Colors.WHITE,
    fontSize: 20,
    fontFamily: Fonts.MEDIUM,
    textAlign: 'center',
    marginBottom: 20
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