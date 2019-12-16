import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar, Text } from 'react-native';

export default class AppointmentsScreen extends Component {
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView />
        <View style={styles.container}>  
        <Text style={{ textAlign: 'center' }}>Appointments</Text>
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