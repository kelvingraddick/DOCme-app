import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, StatusBar, Text, TextInput, TouchableOpacity, TouchableHighlight, Alert, Modal, FlatList, ActivityIndicator } from 'react-native';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import ModelHeader from '../Components/ModalHeader';
import CustomSafeAreaView from '../Components/CustomSafeAreaView';
import UserTypes from '../Constants/UserTypes';
import Icon from 'react-native-ionicons';

class ForgotPasswordScreen extends Component {
  static navigationOptions = {
    title: 'Forgot Password'
  };

  state = {
    isUserTypeSelectModalVisible: false,
    selectedUserTypeOption: {},
    emailAddress: null
  };

  render() {
    return (
      <>
        <StatusBar barStyle='dark-content' />
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.titleText}>Forgot Password</Text>
              <Text style={styles.subTitleText}>Select your <Text style={{fontWeight: 'bold'}}>account type</Text> and enter your <Text style={{fontWeight: 'bold'}}>email address</Text> below to begin <Text style={{ textDecorationLine: 'underline' }}>resetting your password</Text>:</Text>
              <TextInput
                style={styles.textBox}
                placeholder='Patient or doctor?'
                placeholderTextColor={Colors.MEDIUM_BLUE}
                value={this.state.selectedUserTypeOption.name}
                onFocus={() => this.setState({isUserTypeSelectModalVisible: true})}
              />
              <TextInput
                style={styles.textBox}
                placeholder='Email Address'
                placeholderTextColor={Colors.MEDIUM_BLUE}
                autoCompleteType='email'
                autoCapitalize='none'
                value={this.state.emailAddress}
                onChangeText={text => this.setState({emailAddress: text})}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.onSubmitButtonTapped()}
                underlayColor='#fff'
                disabled={this.state.isLoading}>
                {!this.state.isLoading && (
                  <Text style={styles.buttonText}>Submit</Text>
                )}
                {this.state.isLoading && (
                  <ActivityIndicator size="small" color="#ffffff" />
                )}
              </TouchableOpacity>
              {this.state.errorMessage && (
                <Text style={styles.errorText}><Icon name="warning" style={{color:'red'}} />  {this.state.errorMessage}</Text>
              )}
            </View>
          </View>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.isUserTypeSelectModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <CustomSafeAreaView>
              <ModelHeader titleText="Select" onCancelButtonPress={() => this.setState({isUserTypeSelectModalVisible: false})} />
              <FlatList
                data={UserTypes}
                keyExtractor={item => item.id}
                renderItem={({item, index, separators}) => (
                  <TouchableHighlight
                    style={styles.option}
                    onPress={() => this.onUserTypeOptionSelected(item)}
                    onShowUnderlay={separators.highlight}
                    onHideUnderlay={separators.unhighlight}>
                    <Text style={styles.optionText}>{item.name}</Text>
                  </TouchableHighlight>
                )}
                ItemSeparatorComponent={({highlighted}) => (<View style={styles.optionSeparator} />)}
              />
            </CustomSafeAreaView>
          </Modal>
        </ScrollView>
      </>
    );
  }

  onUserTypeOptionSelected(option) {
    this.setState({selectedUserTypeOption: option});
    this.setState({isUserTypeSelectModalVisible: false});
  }

  async onSubmitButtonTapped() {
    this.setState({ isLoading: true });

    await this.validate();
    if (this.state.errorMessage) {
      this.setState({ isLoading: false });
      return;
    }

    var response = await this.submit();
    if (response) {
      if (response.isSuccess) {
        Alert.alert(
          "Success! Check your email to reset your password.",
          "Password reset instructions were sent to the email entered.",
          [{ text: "OK" }],
          { cancelable: false }
        );
        this.props.navigation.goBack();
      } else {
        await this.setState({ errorMessage: response.errorMessage });
        this.setState({ isLoading: false });
      }
    } else {
      Alert.alert(
        "There was an error requested a password reset.",
        "Please update entries and try again",
        [{ text: "OK" }],
        { cancelable: false }
      );
      this.setState({ isLoading: false });
    }
  }

  async validate() {
    var errorMessage = null;
    var emailAddressRegex = /^\w+([\.\-\+]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!this.state.selectedUserTypeOption.id) {
      errorMessage = 'User type (patient or doctor) must be selected.';
    } else if (!emailAddressRegex.test(this.state.emailAddress)) {
      errorMessage = 'Valid email address is required.';
    }
    await this.setState({ errorMessage: errorMessage });
  }

  async submit() {
    var body = {
      emailAddress: this.state.emailAddress
    };
    return fetch('http://www.docmeapp.com/' + this.state.selectedUserTypeOption.id + '/reset/password/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    .then((response) => { 
      if (response.status == 200) {
        return response.json()
        .then((responseJson) => {
          return responseJson;
        })
      } else {
        return undefined;
      }
    })
    .catch((error) => {
      console.error(error);
      return undefined;
    });
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY
  },
  header: {
    alignContent: 'center',
    padding: 20,
    backgroundColor: Colors.LIGHT_BLUE
  },
  titleText: {
    color: Colors.WHITE,
    fontSize: 20,
    fontFamily: Fonts.MEDIUM,
    marginTop: 15,
    marginBottom: 5
  },
  subTitleText: {
    color: Colors.DARK_BLUE,
    fontSize: 15,
    fontFamily: Fonts.MEDIUM,
    marginBottom: 30
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
  },
  errorText: {
    color: Colors.WHITE,
    fontSize: 15,
    fontFamily: Fonts.MEDIUM,
    marginBottom: 30
  },
  // TODO: refactor out modal
  option: {
    height: 55,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  optionText: {
    padding: 10,
    color: Colors.DARK_BLUE,
    fontSize: 15,
    fontFamily: Fonts.NORMAL
  },
  optionSeparator: {
    height: 1,
    backgroundColor: Colors.LIGHT_GRAY
  }
})

export default ForgotPasswordScreen;