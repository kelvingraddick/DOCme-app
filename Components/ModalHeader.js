import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Image } from 'react-native';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';

export default class ModelHeader extends Component {
  static navigationOptions = {
    headerTitle: () => <LogoTitle />
  };

  state = {
    isModalVisible: false
  };

  setModalVisible(visible) {
    this.setState({isModalVisible: visible});
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.onCancelButtonPress()}
          underlayColor='#fff'>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.titleText}>{this.props.titleText}</Text>
        <View style={styles.spacer}></View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    marginTop: 10,
    flexDirection: 'row',
    borderBottomColor: Colors.LIGHT_GRAY,
    borderBottomWidth: 1
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    padding: 10
  },
  buttonText: {
    flex: 1,
    color: Colors.DARK_GRAY,
    fontSize: 15,
    fontFamily: Fonts.BOLD,
    alignSelf: 'center'
  },
  titleText: {
    flex: 1,
    color: Colors.DARK_GRAY,
    fontSize: 18,
    fontFamily: Fonts.BOLD,
    textAlign: 'center',
    alignSelf: 'center'
  },
  spacer: {
    flexDirection: 'row',
    flex: 1,
    padding: 10
  }
})