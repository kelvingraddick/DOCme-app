import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, ScrollView, StyleSheet, View, StatusBar, Text, TextInput, TouchableOpacity, Alert, Modal, ActivityIndicator, FlatList, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DoctorRowView from '../Components/DoctorRowView';
import ModelHeader from '../Components/ModalHeader';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import Actions from '../Constants/Actions';

class BookAppointmentScreen extends Component {
  static navigationOptions = {
    title: 'Book Appointment'
  };

  state = {
    isSpecialtySearchModalVisible: false,
    specialtyOptions: [],
    selectedSpecialtyOption: {}
  };

  render() {
    return (
      <>
        <StatusBar barStyle='dark-content' />
        <SafeAreaView />
        <ScrollView>
          <View style={styles.container}>
            <DoctorRowView doctor={this.props.navigation.state.params.doctor} />
            <View style={styles.header}>
              <Text style={styles.titleText}>Date and Time</Text>
              <Text style={styles.subTitleText}>{this.props.navigation.state.params.date.format('dddd, MMMM Do') + ', ' + this.props.navigation.state.params.time.format('h:mma')}</Text>
              <Text style={styles.titleText}>Speciality</Text>
              <TextInput
                style={styles.textBox}
                placeholder='Speciality'
                placeholderTextColor={Colors.MEDIUM_BLUE}
                value={this.state.selectedSpecialtyOption.name}
                onFocus={() => this.setState({isSpecialtySearchModalVisible: true})}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.onBookButtonTapped()}
                disabled={this.state.isLoading}
                underlayColor='#fff'>
                {!this.state.isLoading && (
                  <Text style={styles.buttonText}>Book</Text>
                )}
                {this.state.isLoading && (
                  <ActivityIndicator size="small" color="#ffffff" />
                )}
              </TouchableOpacity>
              {this.state.errorMessage && (
                <Text style={styles.errorText}>{this.state.errorMessage}</Text>
              )}
            </View>
          </View>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.isSpecialtySearchModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <SafeAreaView />
            <ModelHeader titleText="Search" onCancelButtonPress={() => this.setState({isSpecialtySearchModalVisible: false})} />
            <TextInput
              style={styles.searchBox}
              placeholder='Start typing in a specialty..'
              placeholderTextColor={Colors.GRAY}
              onChangeText={(text) => this.onSpecialtySearchBoxChangeText(text)}
            />
            <FlatList
              data={this.state.specialtyOptions}
              keyExtractor={item => item.id}
              renderItem={({item, index, separators}) => (
                <TouchableHighlight
                  style={styles.option}
                  onPress={() => this.onSpecialtyOptionSelected(item)}
                  onShowUnderlay={separators.highlight}
                  onHideUnderlay={separators.unhighlight}>
                  <Text style={styles.optionText}>{item.name}</Text>
                </TouchableHighlight>
              )}
              ItemSeparatorComponent={({highlighted}) => (<View style={styles.optionSeparator} />)}
            />
          </Modal>
        </ScrollView>
      </>
    );
  }

  async onSpecialtySearchBoxChangeText(text) {
    var specialties = await fetch('http://www.docmeapp.com/specialty/search/' + encodeURIComponent(text), { method: 'GET' })
    .then((response) => { 
      if (response.status == 200) {
        return response.json()
        .then((responseJson) => {
          if (responseJson.isSuccess) {
            return responseJson.specialties;
          }
        })
      }
      return undefined;
    })
    .catch((error) => {
      console.error(error);
      return undefined;
    });

    this.setState({specialtyOptions: specialties});
  }

  onSpecialtyOptionSelected(option) {
    this.setState({selectedSpecialtyOption: option});
    this.setState({isSpecialtySearchModalVisible: false});
    this.setState({specialtyOptions: []});
  }

  async onBookButtonTapped() {
    this.setState({ isLoading: true });

    await this.validate();
    if (this.state.errorMessage) {
      this.setState({ isLoading: false });
      return;
    }

    var response = await this.book();
    if (response) {
      if (response.isSuccess) {
        // TODO
      } else {
        await this.setState({ errorMessage: response.errorMessage });
        this.setState({ isLoading: false });
      }
    } else {
      Alert.alert(
        "There was an error booking",
        "This feature is not yet implemented.",
        [{ text: "OK" }],
        { cancelable: false }
      );
      /*
      Alert.alert(
        "There was an error booking",
        "Please update entries and try again",
        [{ text: "OK" }],
        { cancelable: false }
      );
      */
      this.setState({ isLoading: false });
    }
  }

  async validate() {
    var errorMessage = null;
    if (!this.state.selectedSpecialtyOption.id) {
      errorMessage = 'Must select a speciality.';
    }
    await this.setState({ errorMessage: errorMessage });
  }

  async book() {
    var body = {

    };
    return undefined;
    /*
    return fetch('http://www.docmeapp.com/~', {
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
        console.error(response);
        return undefined;
      }
    })
    .catch((error) => {
      console.error(error);
      return undefined;
    });
    */
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    alignContent: 'center',
    padding: 20,
    backgroundColor: Colors.LIGHT_BLUE
  },
  titleText: {
    color: Colors.WHITE,
    fontSize: 17,
    fontFamily: Fonts.MEDIUM,
    marginBottom: 10
  },
  subTitleText: {
    color: Colors.DARK_BLUE,
    fontSize: 15,
    fontFamily: Fonts.MEDIUM,
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
  textBoxText: {
    color: Colors.WHITE,
    fontSize: 15
  },
  image: {
    height: 100,
    width: 100
  },
  button: {
    color: Colors.WHITE,
    fontSize: 15,
    padding: 17,
    backgroundColor: Colors.DARK_BLUE,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10
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
    fontFamily: Fonts.MEDIUM
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
  },
  searchBox: {
    height: 55,
    padding: 10,
    color: Colors.DARK_GRAY,
    fontSize: 15,
    borderBottomColor: Colors.LIGHT_GRAY,
    borderBottomWidth: 1
  }
})

const mapStateToProps = (state) => {
  var { token, patient, doctor } = state;
  return { token, patient, doctor };
};

export default connect(mapStateToProps)(BookAppointmentScreen);