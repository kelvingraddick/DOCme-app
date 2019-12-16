import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar, Text } from 'react-native';

export default class SignInScreen extends Component {
  render() {
    return (
      <>
        <SafeAreaView />
        <View style={styles.container}>  
          <Text>Sign In</Text>
        </View>
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  }
})