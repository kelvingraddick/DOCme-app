import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

class WebViewScreen extends Component {  
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>  
          <WebView
            originWhitelist={['*']}
            source={{ uri: this.props.navigation.state.params.url }}
            onLoadStart={this.onLoadStart}
            onError={this.onError}
          />
        </View>
      </>
    );
  }

  onSuccessHandler = async () => { /* TODO: do something */ };
  onCanceledHandler = () => { /* TODO: do something */ };

  onLoadStart = async (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    if (nativeEvent.url === this.props.navigation.state.params.url) {
      await this.onSuccessHandler();
    } else {
      this.onCanceledHandler();
    }
  };

  onError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error(nativeEvent);
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  }
});

const mapStateToProps = (state) => {
  var { token, patient, doctor } = state;
  return { token, patient, doctor };
};

export default connect(mapStateToProps)(WebViewScreen);