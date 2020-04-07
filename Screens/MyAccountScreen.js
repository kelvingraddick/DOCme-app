import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar, Text, SectionList } from 'react-native';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import Icon from 'react-native-ionicons';

export default class MyAccountScreen extends Component {
  static navigationOptions = {
    title: 'My Account'
  };

  options = {
    'Sign In': 'log-in',
    'Sign Up': 'clipboard',
    'Terms of use': 'information-circle',
    'Privacy Policy': 'eye-off',
    'Give app feedback': 'ribbon',
    'Share this app': 'share'
  };

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView />
        <SectionList
          style={styles.optionsList}
          keyExtractor={(item, index) => index}
          sections={[{ data: Object.keys(this.options) }]}
          renderItem={({item}) => (
            <View style={styles.optionView}>
              <Icon style={styles.optionIcon} name={this.options[item]} />
              <Text style={styles.optionText}>{item}</Text>
            </View>
          )}
          ListHeaderComponent={(<View style={styles.optionsListHeader}></View>)}
        />
      </>
    );
  }

  getOptionIcon(title) {
    var results = this.options.filter(obj => {
      return obj.title === title
    });
    console.info(results[0]);
    return results[0];
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: Colors.LIGHT_GRAY
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
    lineHeight: 45,
    textAlign: 'center',
    color: Colors.DARK_BLUE
  },
  optionText: {
    color: Colors.DARK_GRAY,
    fontSize: 17,
    lineHeight: 45,
    fontFamily: Fonts.MEDIUM
  }
})