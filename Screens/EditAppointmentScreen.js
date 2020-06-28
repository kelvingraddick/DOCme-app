import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, ScrollView, StyleSheet, View, StatusBar, Text, TextInput, TouchableOpacity, Alert, Modal, ActivityIndicator, FlatList, TouchableHighlight } from 'react-native';
import Moment from 'moment';
import DoctorRowView from '../Components/DoctorRowView';
import ModelHeader from '../Components/ModalHeader';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';

class EditAppointmentScreen extends Component {
  static navigationOptions = {
    title: 'Edit Appointment'
  };

  state = {
    appointment: null,
    isSpecialtySearchModalVisible: false,
    specialtyOptions: [],
    selectedSpecialtyOption: {}
  };

  async componentDidMount() {
    var appointment = await fetch('http://www.docmeapp.com/appointment/' + this.props.navigation.state.params.id, { 
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + this.props.token }
    })
    .then((response) => { 
      if (response.status == 200) {
        return response.json()
        .then((responseJson) => {
          if (responseJson.isSuccess) {
            return responseJson.appointment;
          }
        })
      }
      return undefined;
    })
    .catch((error) => {
      console.error(error);
      return undefined;
    });
    this.setState({appointment: appointment});
    this.setState({selectedSpecialtyOption: appointment.specialty});
  }

  render() {
    return (
      <>
        <StatusBar barStyle='dark-content' />
        <SafeAreaView />
        <ScrollView>
          <View style={styles.container}>
            { this.state.appointment &&
              <DoctorRowView doctor={this.state.appointment.doctor} />
            }
            { this.state.appointment &&
              <View style={styles.header}>
                <Text style={styles.titleText}>Date and Time</Text>
                <Text style={styles.subTitleText}>{Moment(this.state.appointment.timestamp).format('dddd, MMMM Do') + ', ' + Moment(this.state.appointment.timestamp).format('h:mma')}</Text>
                <Text style={styles.titleText}>Reason / Speciality</Text>
                <TextInput
                  style={styles.textBox}
                  placeholder='Reason / Speciality'
                  placeholderTextColor={Colors.MEDIUM_BLUE}
                  value={this.state.selectedSpecialtyOption.name}
                  onFocus={() => this.setState({isSpecialtySearchModalVisible: true})}
                />
                {!this.state.isLoading && (
                  <>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => this.onUpdateButtonTapped()}
                      disabled={this.state.isLoading}
                      underlayColor='#fff'>
                      <Text style={styles.buttonText}>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.deleteButton]}
                      onPress={() => this.onDeleteButtonTapped()}
                      disabled={this.state.isLoading}
                      underlayColor='#fff'>
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </>
                )}
                {this.state.errorMessage && (
                  <Text style={styles.errorText}>{this.state.errorMessage}</Text>
                )}
                {this.state.isLoading && (
                  <ActivityIndicator size="small" color="#ffffff" />
                )}
              </View>
            }
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

  async onUpdateButtonTapped() {
    this.setState({ isLoading: true });

    await this.validate();
    if (this.state.errorMessage) {
      this.setState({ isLoading: false });
      return;
    }

    var response = await this.update();
    if (response) {
      if (response.isSuccess) {
        Alert.alert(
          "Success!",
          "The appointment has been updated!",
          [{ text: "OK" }],
          { cancelable: false }
        );
        this.props.navigation.popToTop();
        this.props.navigation.navigate('AppointmentsScreenStackNavigator');
      } else {
        await this.setState({ errorMessage: response.errorMessage });
        this.setState({ isLoading: false });
      }
    } else {
      Alert.alert(
        "There was an error updating",
        "Please update entries and try again",
        [{ text: "OK" }],
        { cancelable: false }
      );
      this.setState({ isLoading: false });
    }
  }

  async onDeleteButtonTapped() {
    this.setState({ isLoading: true });

    var response = await this.delete();
    if (response) {
      if (response.isSuccess) {
        Alert.alert(
          "Success!",
          "The appointment has been deleted!",
          [{ text: "OK" }],
          { cancelable: false }
        );
        this.props.navigation.popToTop();
        this.props.navigation.navigate('AppointmentsScreenStackNavigator');
      } else {
        await this.setState({ errorMessage: response.errorMessage });
        this.setState({ isLoading: false });
      }
    } else {
      Alert.alert(
        "There was an error deleting",
        "Please update entries and try again",
        [{ text: "OK" }],
        { cancelable: false }
      );
      this.setState({ isLoading: false });
    }
  }

  async validate() {
    var errorMessage = null;
    if (!this.state.appointment.specialty.id) {
      errorMessage = 'Must select a speciality.';
    }
    if (!this.props.patient || !this.props.token) {
      errorMessage = 'Must sign in or sign up to update.';
    }
    await this.setState({ errorMessage: errorMessage });
  }

  async update() {
    var body = {
      specialtyId: this.state.selectedSpecialtyOption.id,
      timestamp: this.state.appointment.timestamp,
      isNewPatient: true,
      notes: "These are notes."
    };
    return await fetch('http://www.docmeapp.com/appointment/' + this.state.appointment.id + '/update/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.token
      },
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

  async delete() {
    return await fetch('http://www.docmeapp.com/appointment/' + this.state.appointment.id + '/delete/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.token
      }
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
  deleteButton: {
    fontSize: 15,
    padding: 17,
    backgroundColor: Colors.DARK_BLUE,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10
  },
  deleteButtonText: {
    color: Colors.RED,
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

export default connect(mapStateToProps)(EditAppointmentScreen);