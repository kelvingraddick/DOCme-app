import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, View, StatusBar, Text, TextInput, Switch, Modal, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import DatePicker from 'react-native-date-picker';
import ModelHeader from '../Components/ModalHeader';
import CustomSafeAreaView from '../Components/CustomSafeAreaView';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import Actions from '../Constants/Actions';

class EditScheduleScreen extends Component {
  static navigationOptions = {
    title: 'Edit Schedule'
  };

  state = {
    errorMessage: null,
    isLoading: false,
    timeSelectModalDayOfWeek: null,
    timeSelectModalTimeProperty: null,
    schedule: {
      sunday: {
        name: 'Sunday',
        isEnabled: this.props.doctor.schedule.sundayAvailabilityStartTime !== null,
        availabilityStartTime: this.props.doctor.schedule.sundayAvailabilityStartTime,
        availabilityEndTime: this.props.doctor.schedule.sundayAvailabilityEndTime,
        breakStartTime: this.props.doctor.schedule.sundayBreakStartTime,
        breakEndTime: this.props.doctor.schedule.sundayBreakEndTime
      },
      monday: {
        name: 'Monday',
        isEnabled: this.props.doctor.schedule.mondayAvailabilityStartTime !== null,
        availabilityStartTime: this.props.doctor.schedule.mondayAvailabilityStartTime,
        availabilityEndTime: this.props.doctor.schedule.mondayAvailabilityEndTime,
        breakStartTime: this.props.doctor.schedule.mondayBreakStartTime,
        breakEndTime: this.props.doctor.schedule.mondayBreakEndTime
      },
      tuesday: {
        name: 'Tuesday',
        isEnabled: this.props.doctor.schedule.tuesdayAvailabilityStartTime !== null,
        availabilityStartTime: this.props.doctor.schedule.tuesdayAvailabilityStartTime,
        availabilityEndTime: this.props.doctor.schedule.tuesdayAvailabilityEndTime,
        breakStartTime: this.props.doctor.schedule.tuesdayBreakStartTime,
        breakEndTime: this.props.doctor.schedule.tuesdayBreakEndTime
      },
      wednesday: {
        name: 'Wednesday',
        isEnabled: this.props.doctor.schedule.wednesdayAvailabilityStartTime !== null,
        availabilityStartTime: this.props.doctor.schedule.wednesdayAvailabilityStartTime,
        availabilityEndTime: this.props.doctor.schedule.wednesdayAvailabilityEndTime,
        breakStartTime: this.props.doctor.schedule.wednesdayBreakStartTime,
        breakEndTime: this.props.doctor.schedule.wednesdayBreakEndTime
      },
      thursday: {
        name: 'Thursday',
        isEnabled: this.props.doctor.schedule.thursdayAvailabilityStartTime !== null,
        availabilityStartTime: this.props.doctor.schedule.thursdayAvailabilityStartTime,
        availabilityEndTime: this.props.doctor.schedule.thursdayAvailabilityEndTime,
        breakStartTime: this.props.doctor.schedule.thursdayBreakStartTime,
        breakEndTime: this.props.doctor.schedule.thursdayBreakEndTime
      },
      friday: {
        name: 'Friday',
        isEnabled: this.props.doctor.schedule.fridayAvailabilityStartTime !== null,
        availabilityStartTime: this.props.doctor.schedule.fridayAvailabilityStartTime,
        availabilityEndTime: this.props.doctor.schedule.fridayAvailabilityEndTime,
        breakStartTime: this.props.doctor.schedule.fridayBreakStartTime,
        breakEndTime: this.props.doctor.schedule.fridayBreakEndTime
      },
      saturday: {
        name: 'Saturday',
        isEnabled: this.props.doctor.schedule.saturdayAvailabilityStartTime !== null,
        availabilityStartTime: this.props.doctor.schedule.saturdayAvailabilityStartTime,
        availabilityEndTime: this.props.doctor.schedule.saturdayAvailabilityEndTime,
        breakStartTime: this.props.doctor.schedule.saturdayBreakStartTime,
        breakEndTime: this.props.doctor.schedule.saturdayBreakEndTime
      }
    }
  };

  render() {
    return (
      <>
        <StatusBar barStyle='dark-content' />
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.titleText}>Edit and save your schedule details below.</Text>
              { Object.keys(this.state.schedule).map((dayOfWeek, index) =>
                <View style={styles.controlGroupContainer}>
                  <Text style={styles.subTitleText}>Available on {this.state.schedule[dayOfWeek].name}?</Text>
                  <Switch
                    style={styles.switch}
                    trackColor={{ false: Colors.DARK_BLUE, true: Colors.DARK_BLUE }}
                    thumbColor={this.state.schedule[dayOfWeek].isEnabled ? Colors.WHITE : Colors.LIGHT_BLUE}
                    ios_backgroundColor={Colors.DARK_BLUE}
                    onValueChange={(isEnabled) => {
                      var schedule = {...this.state.schedule};
                      schedule[dayOfWeek].isEnabled = isEnabled;
                      this.setState({schedule});
                    }}
                    value={this.state.schedule[dayOfWeek].isEnabled}
                  />
                  <Text style={styles.subTitleText}>{this.state.schedule[dayOfWeek].name} availability start time</Text>
                  <TextInput
                    style={styles.textBox}
                    placeholder='Select time'
                    placeholderTextColor={Colors.MEDIUM_BLUE}
                    defaultValue={this.state.schedule[dayOfWeek].availabilityStartTime}
                    onFocus={() => { 
                      this.setState({timeSelectModalDayOfWeek: dayOfWeek});
                      this.setState({timeSelectModalTimeProperty: 'availabilityStartTime'});
                    }}
                  />
                  <Text style={styles.subTitleText}>{this.state.schedule[dayOfWeek].name} break start time</Text>
                  <TextInput
                    style={styles.textBox}
                    placeholder='Select time'
                    placeholderTextColor={Colors.MEDIUM_BLUE}
                    defaultValue={this.state.schedule[dayOfWeek].breakStartTime}
                    onFocus={() => { 
                      this.setState({timeSelectModalDayOfWeek: dayOfWeek});
                      this.setState({timeSelectModalTimeProperty: 'breakStartTime'});
                    }}
                  />
                  <Text style={styles.subTitleText}>{this.state.schedule[dayOfWeek].name} break end time</Text>
                  <TextInput
                    style={styles.textBox}
                    placeholder='Select time'
                    placeholderTextColor={Colors.MEDIUM_BLUE}
                    defaultValue={this.state.schedule[dayOfWeek].breakEndTime}
                    onFocus={() => { 
                      this.setState({timeSelectModalDayOfWeek: dayOfWeek});
                      this.setState({timeSelectModalTimeProperty: 'breakEndTime'});
                    }}
                  />
                  <Text style={styles.subTitleText}>{this.state.schedule[dayOfWeek].name} availability end time</Text>
                  <TextInput
                    style={styles.textBox}
                    placeholder='Select time'
                    placeholderTextColor={Colors.MEDIUM_BLUE}
                    defaultValue={this.state.schedule[dayOfWeek].availabilityEndTime}
                    onFocus={() => { 
                      this.setState({timeSelectModalDayOfWeek: dayOfWeek});
                      this.setState({timeSelectModalTimeProperty: 'availabilityEndTime'});
                    }}
                  />
                </View>
              )}
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.onSaveButtonTapped()}
                disabled={this.state.isLoading}
                underlayColor='#fff'>
                {!this.state.isLoading && (
                  <Text style={styles.buttonText}>Save Changes</Text>
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
            visible={this.state.timeSelectModalDayOfWeek !== null}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <CustomSafeAreaView>
              <ModelHeader titleText="Select" onCancelButtonPress={() => this.closeTimeSelectModal()} />
              <View style={styles.modalContent}>
                <DatePicker
                  date={
                    this.state.timeSelectModalDayOfWeek &&
                    this.getDateTimeFrom24HourTime(this.state.schedule[this.state.timeSelectModalDayOfWeek][this.state.timeSelectModalTimeProperty])
                  }
                  onDateChange={(dateTime) => this.onTimeSelect(dateTime)}
                  mode='time'
                  minuteInterval={30}
                />
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.closeTimeSelectModal()}
                  disabled={this.state.isLoading}
                  underlayColor='#fff'>
                  <Text style={styles.buttonText}>Done</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.delelteButton}
                  onPress={() => { 
                    this.onTimeSelect(null);
                    this.closeTimeSelectModal();
                  }}
                  disabled={this.state.isLoading}
                  underlayColor='#fff'>
                  <Text style={styles.deleteButtonText}>Clear</Text>
                </TouchableOpacity>
              </View>
            </CustomSafeAreaView>
          </Modal>
        </ScrollView>
      </>
    );
  }

  onTimeSelect(dateTime) {
    var schedule = {...this.state.schedule};
    var time = this.get24HourTimeFromDateTime(dateTime);
    schedule[this.state.timeSelectModalDayOfWeek][this.state.timeSelectModalTimeProperty] = time;
    schedule[this.state.timeSelectModalDayOfWeek].isEnabled = time !== null;
    this.setState({schedule});
  }

  getDateTimeFrom24HourTime(time) {
    return time ? new Date(new Date().toDateString() + ' ' + time) : new Date();
  }

  get24HourTimeFromDateTime(dateTime) {
    return dateTime && (((dateTime.getHours() < 10 ? '0' : '') + dateTime.getHours()) + ':' + ((dateTime.getMinutes() < 10 ? '0' : '') + dateTime.getMinutes()) + ':00');
  }

  closeTimeSelectModal() {
    this.setState({timeSelectModalDayOfWeek: null});
    this.setState({timeSelectModalTimeProperty: null});
  }

  async onSaveButtonTapped() {
    this.setState({ isLoading: true });

    await this.validate();
    if (this.state.errorMessage) {
      this.setState({ isLoading: false });
      return;
    }

    var response = await this.save();
    if (response) {
      if (response.isSuccess) {
        this.props.dispatch({ type: Actions.SET_DOCTOR, doctor: response.doctor  || null });
        this.props.navigation.goBack();
      } else {
        await this.setState({ errorMessage: response.errorMessage });
        this.setState({ isLoading: false });
      }
    } else {
      Alert.alert(
        "There was an error saving the schedule",
        "Please update entries and try again",
        [{ text: "OK" }],
        { cancelable: false }
      );
      this.setState({ isLoading: false });
    }
  }

  async validate() {
    var errorMessage = null;
    var schedule = this.state.schedule;
    for (var dayOfWeek of Object.keys(schedule)) {
      if (schedule[dayOfWeek].isEnabled) {
        if (!schedule[dayOfWeek].availabilityStartTime) {
          errorMessage = schedule[dayOfWeek].name + ' availability start time is required.';
        } else if (!schedule[dayOfWeek].availabilityEndTime) {
          errorMessage = schedule[dayOfWeek].name + ' availability end time is required.';
        } else if (!schedule[dayOfWeek].breakStartTime && schedule[dayOfWeek].breakEndTime) {
          errorMessage = schedule[dayOfWeek].name + ' break start time is required.';
        } else if (schedule[dayOfWeek].breakStartTime && !schedule[dayOfWeek].breakEndTime) {
          errorMessage = schedule[dayOfWeek].name + ' break end time is required.';
        }
      }
    }
    await this.setState({ errorMessage: errorMessage });
  }

  async save() {
    var schedule = this.state.schedule;

    var requestBody = {};
    for (var dayOfWeek of Object.keys(schedule)) {
      requestBody[dayOfWeek + 'AvailabilityStartTime'] = schedule[dayOfWeek].isEnabled ? schedule[dayOfWeek].availabilityStartTime : null;
      requestBody[dayOfWeek + 'AvailabilityEndTime'] = schedule[dayOfWeek].isEnabled ? schedule[dayOfWeek].availabilityEndTime : null;
      requestBody[dayOfWeek + 'BreakStartTime'] = schedule[dayOfWeek].isEnabled ? schedule[dayOfWeek].breakStartTime : null;
      requestBody[dayOfWeek + 'BreakEndTime'] = schedule[dayOfWeek].isEnabled ? schedule[dayOfWeek].breakEndTime : null;
    }
    console.info(requestBody);

    return fetch('http://www.docmeapp.com/doctor/' + this.props.doctor.id + '/update/schedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.props.token
      },
      body: JSON.stringify(requestBody)
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
  controlGroupContainer: {
    marginBottom: 30
  },
  titleText: {
    color: Colors.WHITE,
    fontSize: 17,
    fontFamily: Fonts.MEDIUM,
    marginBottom: 30
  },
  subTitleText: {
    color: Colors.DARK_BLUE,
    fontSize: 15,
    fontFamily: Fonts.MEDIUM,
    marginBottom: 10
  },
  switch: {
    marginBottom: 10
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
    fontFamily: Fonts.MEDIUM,
    marginBottom: 30
  },
  modalContent: {
    padding: 20
  }
})

const mapStateToProps = (state) => {
  var { token, patient, doctor } = state;
  return { token, patient, doctor };
};

export default connect(mapStateToProps)(EditScheduleScreen);