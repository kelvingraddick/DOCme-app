import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, View, StatusBar, Text, TextInput, TouchableOpacity, Alert, Modal, ActivityIndicator, FlatList, TouchableHighlight } from 'react-native';
import Moment from 'moment';
import DoctorRowView from '../Components/DoctorRowView';
import ModelHeader from '../Components/ModalHeader';
import CustomSafeAreaView from '../Components/CustomSafeAreaView';
import Actions from '../Constants/Actions';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import RatingValues from '../Constants/RatingValues';

class RateAppointmentScreen extends Component {
  static navigationOptions = {
    title: 'Rate Appointment'
  };

  state = {
    appointment: null,
    isValueSelectModalVisible: false,
    selectedValueOption: {},
    notes: null,
    errorMessage: null,
    isLoading: false
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
  }

  render() {
    return (
      <>
        <StatusBar barStyle='dark-content' />
        <ScrollView>
          <View style={styles.container}>
            { this.state.appointment &&
              <DoctorRowView doctor={this.state.appointment.doctor} />
            }
            { this.state.appointment &&
              <View style={styles.header}>
                <Text style={styles.titleText}>Date and Time</Text>
                <Text style={styles.subTitleText}>{Moment(this.state.appointment.timestamp).format('dddd, MMMM Do') + ', ' + Moment(this.state.appointment.timestamp).format('h:mma')}</Text>
                <Text style={styles.titleText}>Rate your experience from 1 (lowest) to 5 (highest)</Text>
                <TextInput
                  style={styles.textBox}
                  placeholder='Select rating value'
                  placeholderTextColor={Colors.MEDIUM_BLUE}
                  value={this.state.selectedValueOption.name}
                  onFocus={() => this.setState({isValueSelectModalVisible: true})}
                />
                <Text style={styles.titleText}>Any comments about your experience?</Text>
                <TextInput
                  multiline={true}
                  textAlignVertical='center'
                  numberOfLines={10}
                  style={[styles.textBox, { ...Platform.select({ ios: { lineHeight: 30 }, android: {} }) }]}
                  placeholder='Enter comments'
                  placeholderTextColor={Colors.MEDIUM_BLUE}
                  defaultValue={this.state.notes}
                  onChangeText={text => this.state.notes = text}
                />
                {!this.state.isLoading && (
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.onSubmitButtonTapped()}
                    disabled={this.state.isLoading}
                    underlayColor='#fff'>
                    <Text style={styles.buttonText}>Submit</Text>
                  </TouchableOpacity>
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
            visible={this.state.isValueSelectModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <CustomSafeAreaView>
              <ModelHeader titleText="Select" onCancelButtonPress={() => this.setState({isValueSelectModalVisible: false})} />
              <FlatList
                data={RatingValues}
                keyExtractor={item => item.id}
                renderItem={({item, index, separators}) => (
                  <TouchableHighlight
                    style={styles.option}
                    onPress={() => this.onValueOptionSelected(item)}
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

  onValueOptionSelected(option) {
    this.setState({selectedValueOption: option});
    this.setState({isValueSelectModalVisible: false});
  }

  async onSubmitButtonTapped() {
    this.setState({ isLoading: true });

    await this.validate();
    if (this.state.errorMessage) {
      this.setState({ isLoading: false });
      return;
    }

    var response = await this.upsert();
    if (response) {
      if (response.isSuccess) {
        Alert.alert(
          "Success!",
          "The rating has been submitted!",
          [{ text: "OK" }],
          { cancelable: false }
        );
        this.props.dispatch({ type: Actions.SET_APPOINTMENTS, appointments: [] }); // will trigger refresh on AppointmentsScreen
        this.props.navigation.popToTop();
        this.props.navigation.navigate('AppointmentsScreenStackNavigator');
      } else {
        await this.setState({ errorMessage: response.errorMessage });
        this.setState({ isLoading: false });
      }
    } else {
      Alert.alert(
        "There was an error submitting",
        "Please update entries and try again",
        [{ text: "OK" }],
        { cancelable: false }
      );
      this.setState({ isLoading: false });
    }
  }

  async validate() {
    var errorMessage = null;
    if (!this.state.selectedValueOption.id) {
      errorMessage = 'Must select a rating value.';
    }
    if ((!this.props.patient && !this.props.doctor) || !this.props.token) {
      errorMessage = 'Must sign in or sign up to update.';
    }
    await this.setState({ errorMessage: errorMessage });
  }

  async upsert() {
    var body = {
      patientId: this.props.patient?.id,
      doctorId: this.state.appointment.doctor.id,
      timestamp: Moment().toJSON(),
      value: this.state.selectedValueOption.id,
      notes: this.state.notes
    };
    return await fetch('http://www.docmeapp.com/rating/upsert', {
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

export default connect(mapStateToProps)(RateAppointmentScreen);