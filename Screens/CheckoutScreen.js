import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, StyleSheet, View, StatusBar } from 'react-native';
import { STRIPE_PUBLIC_KEY, STRIPE_PRODUCT_ID, STRIPE_SUCCESS_URL, STRIPE_CANCELED_URL } from 'react-native-dotenv';
import AsyncStorage from '@react-native-community/async-storage';
import { WebView } from 'react-native-webview';
import Actions from '../Constants/Actions';
import Login from '../Helpers/Login';

class CheckoutScreen extends Component {
  static navigationOptions = {
    title: 'Subscribe as doctor'
  };
  
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView />
        <View style={styles.container}>  
          <WebView
            originWhitelist={['*']}
            source={{ html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <title>Hello Bulma!</title>
                  <script src="https://js.stripe.com/v3"></script>
                  <script>
                    (function () {
                      var stripe = Stripe('${STRIPE_PUBLIC_KEY}');
                      window.onload = function () {
                        stripe.redirectToCheckout({
                          items: [{ plan: '${STRIPE_PRODUCT_ID}', quantity: 1 }],
                          successUrl: '${STRIPE_SUCCESS_URL}',
                          cancelUrl: '${STRIPE_CANCELED_URL}',
                          clientReferenceId: '${this.props.doctor && this.props.doctor.id}',
                          customerEmail: '${this.props.doctor && this.props.doctor.emailAddress}',
                        })
                        .then(function (result) {
                          if (result.error) {
                            var loadingBar = document.getElementById('loading-bar');
                            loadingBar.style.display = 'none';
                            var errorBox = document.getElementById('error-box');
                            errorBox.style.display = 'block';
                            var errorMessage = document.getElementById('error-message');
                            errorMessage.textContent = result.error.message;
                          }
                        });
                      };
                    })();
                  </script>
                  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
                  <style>
                    html, body {
                      height: 100%;
                      max-width: 100%;
                    }
                  </style>
                </head>
                <body>
                  <section class="section" style="margin-top: 50%;">
                    <div class="container">
                      <progress id="loading-bar" class="progress is-large is-info" max="100"></progress>
                      <article id="error-box" class="message is-danger" style="display:none;">
                        <div class="message-header">
                          <p>An error occured. Please go back and try again.</p>
                        </div>
                        <div id="error-message" class="message-body">
                          Error Message
                        </div>
                      </article>
                    </div>
                  </section>
                </body>
              </html>
              ` }}
            onLoadStart={this.onLoadStart}
            onError={this.onError}
          />
        </View>
      </>
    );
  }

  onSuccessHandler = async () => {
    var token = await AsyncStorage.getItem('TOKEN');
    if (token) { 
      var response = await Login.withToken('doctor', token);
      if (response) {
        await this.props.dispatch({ type: Actions.SET_DOCTOR, doctor: response.doctor || null });
      }
    }
    this.props.navigation.popToTop();
  };
  onCanceledHandler = () => { /* TODO: do something */ };

  onLoadStart = async (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    if (nativeEvent.url === STRIPE_SUCCESS_URL) {
      await this.onSuccessHandler();
      return;
    }
    if (nativeEvent.url === STRIPE_CANCELED_URL) {
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

export default connect(mapStateToProps)(CheckoutScreen);