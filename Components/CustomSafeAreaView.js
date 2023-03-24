import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Platform } from 'react-native';

export default class CustomSafeAreaView extends Component {
  render() {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        {this.props.children}
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? 0 : -25,
    marginBottom: Platform.OS === 'android' ? 0 : -15
  }
})