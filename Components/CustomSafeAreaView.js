import React, { Component } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

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
    marginTop: -25,
    marginBottom: -15
  }
})