import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView, ScrollView, StyleSheet, View, StatusBar, Text, TextInput, Modal, TouchableOpacity, TouchableHighlight, Alert, Image, ActivityIndicator, FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import { RNS3 } from 'react-native-s3-upload';
import { AWS_ACCESS_KEY_ID, AWS_ACCESS_KEY_SECRET } from 'react-native-dotenv';
import ModelHeader from '../Components/ModalHeader';
import Genders from '../Constants/Genders';
import Races from '../Constants/Races';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import Actions from '../Constants/Actions';

class EditAccountScreen extends Component {
  static navigationOptions = {
    title: 'Edit Account'
  };

  state = {
    errorMessage: null,
    isLoading: false,
    isGenderSelectModalVisible: false,
    isRaceSelectModalVisible: false
  };

  componentDidMount() {

  }

  render() {
    return (
      <>
        <StatusBar barStyle='dark-content' />
        <SafeAreaView />
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.subTitleText}>Edit and save your account details below.</Text>
              { this.props.patient &&
                <View>
                  <TextInput
                    style={styles.textBox}
                    placeholder='First Name'
                    placeholderTextColor={Colors.MEDIUM_BLUE}
                    defaultValue={this.props.patient.firstName}
                    onChangeText={text => this.props.patient.firstName = text}
                  />
                  <TextInput
                    style={styles.textBox}
                    placeholder='Last Name'
                    placeholderTextColor={Colors.MEDIUM_BLUE}
                    defaultValue={this.props.patient.lastName}
                    onChangeText={text => this.props.patient.lastName = text}
                  />
                  <TextInput
                    style={styles.textBox}
                    placeholder='Email Address'
                    placeholderTextColor={Colors.MEDIUM_BLUE}
                    autoCompleteType='email'
                    autoCapitalize='none'
                    defaultValue={this.props.patient.emailAddress}
                    onChangeText={text => this.props.patient.emailAddress = text}
                  />
                  <TextInput
                    style={styles.textBox}
                    placeholder='Gender'
                    placeholderTextColor={Colors.MEDIUM_BLUE}
                    defaultValue={Genders.find(x => x.id == this.props.patient.gender)?.name}
                    onFocus={() => this.setState({isGenderSelectModalVisible: true})}
                  />
                  <TextInput
                    style={styles.textBox}
                    placeholder='Race'
                    placeholderTextColor={Colors.MEDIUM_BLUE}
                    defaultValue={Races.find(x => x.id == this.props.patient.race)?.name}
                    onFocus={() => this.setState({isRaceSelectModalVisible: true})}
                  />
                  <TouchableOpacity
                    style={styles.textBox}
                    onPress={() => this.onChooseImage()}
                    underlayColor='#fff'>
                    {!this.props.patient.imageUrl && (
                      <Text style={styles.textBoxText}>Choose an account image</Text>
                    )}
                    {this.props.patient.imageUrl && (
                      <Image
                        source={{ uri: this.props.patient.imageUrl }}
                        style={styles.image}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              }
              { this.props.doctor &&
                <View>
                  <TextInput
                    style={styles.textBox}
                    placeholder='First Name'
                    placeholderTextColor={Colors.MEDIUM_BLUE}
                    defaultValue={this.props.doctor.firstName}
                    onChangeText={text => this.props.doctor.firstName = text}
                  />
                  <TextInput
                    style={styles.textBox}
                    placeholder='Last Name'
                    placeholderTextColor={Colors.MEDIUM_BLUE}
                    defaultValue={this.props.doctor.lastName}
                    onChangeText={text => this.props.doctor.lastName = text}
                  />
                  <TextInput
                    style={styles.textBox}
                    placeholder='Email Address'
                    placeholderTextColor={Colors.MEDIUM_BLUE}
                    autoCompleteType='email'
                    autoCapitalize='none'
                    defaultValue={this.props.doctor.emailAddress}
                    onChangeText={text => this.props.doctor.emailAddress = text}
                  />
                  <TextInput
                    style={styles.textBox}
                    placeholder='Gender'
                    placeholderTextColor={Colors.MEDIUM_BLUE}
                    defaultValue={Genders.find(x => x.id == this.props.doctor.gender)?.name}
                    onFocus={() => this.setState({isGenderSelectModalVisible: true})}
                  />
                  <TextInput
                    style={styles.textBox}
                    placeholder='Race'
                    placeholderTextColor={Colors.MEDIUM_BLUE}
                    defaultValue={Races.find(x => x.id == this.props.doctor.race)?.name}
                    onFocus={() => this.setState({isRaceSelectModalVisible: true})}
                  />
                  <TouchableOpacity
                    style={styles.textBox}
                    onPress={() => this.onChooseImage()}
                    underlayColor='#fff'>
                    {!this.props.doctor.imageUrl && (
                      <Text style={styles.textBoxText}>Choose an account image</Text>
                    )}
                    {this.props.doctor.imageUrl && (
                      <Image
                        source={{ uri: this.props.doctor.imageUrl }}
                        style={styles.image}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              }
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
            visible={this.state.isGenderSelectModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <SafeAreaView />
            <ModelHeader titleText="Select" onCancelButtonPress={() => this.setState({isGenderSelectModalVisible: false})} />
            <FlatList
              data={Genders}
              keyExtractor={item => item.id}
              renderItem={({item, index, separators}) => (
                <TouchableHighlight
                  style={styles.option}
                  onPress={() => this.onGenderOptionSelected(item)}
                  onShowUnderlay={separators.highlight}
                  onHideUnderlay={separators.unhighlight}>
                  <Text style={styles.optionText}>{item.name}</Text>
                </TouchableHighlight>
              )}
              ItemSeparatorComponent={({highlighted}) => (<View style={styles.optionSeparator} />)}
            />
          </Modal>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.isRaceSelectModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <SafeAreaView />
            <ModelHeader titleText="Select" onCancelButtonPress={() => this.setState({isRaceSelectModalVisible: false})} />
            <FlatList
              data={Races}
              keyExtractor={item => item.id}
              renderItem={({item, index, separators}) => (
                <TouchableHighlight
                  style={styles.option}
                  onPress={() => this.onRaceOptionSelected(item)}
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

  onGenderOptionSelected(option) {
    if (this.props.patient) { this.props.patient.gender = option.id; }
    else if (this.props.doctor) { this.props.doctor.gender = option.id; }
    this.setState({isGenderSelectModalVisible: false});
  }

  onRaceOptionSelected(option) {
    if (this.props.patient) { this.props.patient.race = option.id; }
    else if (this.props.doctor) { this.props.doctor.race = option.id; }
    this.setState({isRaceSelectModalVisible: false});
  }

  async onChooseImage() {
    const options = {
      mediaType: 'photo',
      noData: true
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.uri) {
        var image = response;
        var file = {
          name: 'user.' + Date.now() + '.' + Math.round(Math.random() * 1E9) + '.' + (/(?:\.([^.]+))?$/).exec(image.uri)[1],
          type: image.type,
          uri: image.uri
        };
        var options = {
          keyPrefix: 'images/user/',
          bucket: 'wavelink-docme',
          region: 'us-east-1',
          accessKey: AWS_ACCESS_KEY_ID,
          secretKey: AWS_ACCESS_KEY_SECRET,
          successActionStatus: 201
        };
        this.setState({ isLoading: true });
        RNS3.put(file, options).then(response => {
          if (response.status === 201) {
            var imageUrl = response.body.postResponse.location;
            if (this.props.patient) { this.props.patient.imageUrl = imageUrl; }
            else if (this.props.doctor) { this.props.doctor.imageUrl = imageUrl; }
          } else {
            console.error('Failed to upload image to S3');
          }
          this.setState({ isLoading: false });
        });
      }
    });
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
        this.props.dispatch({ type: Actions.SET_PATIENT, patient: response.patient || null });
        this.props.dispatch({ type: Actions.SET_DOCTOR, doctor: response.doctor  || null });
        this.props.navigation.goBack();
      } else {
        await this.setState({ errorMessage: response.errorMessage });
        this.setState({ isLoading: false });
      }
    } else {
      Alert.alert(
        "There was an error saving changes",
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
    if (this.props.patient) {
      var patient = this.props.patient;
      if (!patient.firstName || patient.firstName.length <= 2 || patient.firstName.length >= 30) {
        errorMessage = 'First name must be between 2 and 30 characters.';
      } else if (!patient.lastName || patient.lastName.length <= 2 || patient.lastName.length >= 30) {
        errorMessage = 'Last name must be between 2 and 30 characters.';
      } else if (!emailAddressRegex.test(patient.emailAddress)) {
        errorMessage = 'Valid email address is required.';
      }
    } else if (this.props.doctor) {
      var doctor = this.props.doctor;
      if (!doctor.firstName || doctor.firstName.length <= 2 || doctor.firstName.length >= 30) {
        errorMessage = 'First name must be between 2 and 30 characters.';
      } else if (!doctor.lastName || doctor.lastName.length <= 2 || doctor.lastName.length >= 30) {
        errorMessage = 'Last name must be between 2 and 30 characters.';
      } else if (!emailAddressRegex.test(doctor.emailAddress)) {
        errorMessage = 'Valid email address is required.';
      }
    }
    await this.setState({ errorMessage: errorMessage });
  }

  async save() {
    var url = 'http://www.docmeapp.com';
    var body = {};
    if (this.props.patient) {
      var patient = this.props.patient;
      url += '/patient/' + patient.id + '/update';
      body.firstName = patient.firstName;
      body.lastName = patient.lastName;
      body.gender = patient.gender;
      body.emailAddress = patient.emailAddress;
      body.race = patient.race;
      body.imageUrl = patient.imageUrl;
    } else if (this.props.doctor) {
      var doctor = this.props.doctor;
      url += '/doctor/' + doctor.id + '/update';
      body.firstName = doctor.firstName;
      body.lastName = doctor.lastName;
      body.emailAddress = doctor.emailAddress;
      body.gender = doctor.gender;
      body.race = doctor.race;
      body.imageUrl = doctor.imageUrl;
    }
    return fetch(url, {
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
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY
  },
  header: {
    alignContent: 'center',
    padding: 20,
    backgroundColor: Colors.LIGHT_BLUE
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

const mapStateToProps = (state) => {
  var { token, patient, doctor } = state;
  return { token, patient, doctor };
};

export default connect(mapStateToProps)(EditAccountScreen);