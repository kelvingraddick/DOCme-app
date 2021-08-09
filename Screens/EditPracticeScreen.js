import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet, View, StatusBar, Text, TextInput, Modal, TouchableOpacity, TouchableHighlight, Alert, Image, ActivityIndicator, FlatList } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { RNS3 } from 'react-native-s3-upload';
import { AWS_ACCESS_KEY_ID, AWS_ACCESS_KEY_SECRET } from 'react-native-dotenv';
import ModelHeader from '../Components/ModalHeader';
import CustomSafeAreaView from '../Components/CustomSafeAreaView';
import Cities from '../Constants/Cities';
import States from '../Constants/States';
import Countries from '../Constants/Countries';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import Actions from '../Constants/Actions';

class EditPracticeScreen extends Component {
  static navigationOptions = {
    title: 'Edit Practice'
  };

  state = {
    errorMessage: null,
    isLoading: false,
    isCitySelectModalVisible: false,
    isStateSelectModalVisible: false,
    isCountrySelectModalVisible: false
  };

  componentWillMount() {
    this.props.doctor.practice = this.props.doctor.practice || {};
  }

  render() {
    return (
      <>
        <StatusBar barStyle='dark-content' />
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.subTitleText}>Edit and save your practice details below.</Text>
              <View>
                <TextInput
                  style={styles.textBox}
                  placeholder='Name'
                  placeholderTextColor={Colors.MEDIUM_BLUE}
                  defaultValue={this.props.doctor.practice.name}
                  onChangeText={text => this.props.doctor.practice.name = text}
                />
                <TextInput
                  style={styles.textBox}
                  placeholder='Description'
                  placeholderTextColor={Colors.MEDIUM_BLUE}
                  defaultValue={this.props.doctor.practice.description}
                  onChangeText={text => this.props.doctor.practice.description = text}
                />
                <TextInput
                  style={styles.textBox}
                  placeholder='Website'
                  placeholderTextColor={Colors.MEDIUM_BLUE}
                  defaultValue={this.props.doctor.practice.website}
                  onChangeText={text => this.props.doctor.practice.website = text}
                />
                <TextInput
                  style={styles.textBox}
                  placeholder='Email Address'
                  placeholderTextColor={Colors.MEDIUM_BLUE}
                  autoCompleteType='email'
                  autoCapitalize='none'
                  defaultValue={this.props.doctor.practice.emailAddress}
                  onChangeText={text => this.props.doctor.practice.emailAddress = text}
                />
                <TextInput
                  style={styles.textBox}
                  placeholder='Phone Number'
                  placeholderTextColor={Colors.MEDIUM_BLUE}
                  autoCompleteType='phone'
                  autoCapitalize='none'
                  defaultValue={this.props.doctor.practice.phoneNumber}
                  onChangeText={text => this.props.doctor.practice.phoneNumber = text}
                />
                <TextInput
                  style={styles.textBox}
                  placeholder='Fax Number'
                  placeholderTextColor={Colors.MEDIUM_BLUE}
                  autoCompleteType='phone'
                  autoCapitalize='none'
                  defaultValue={this.props.doctor.practice.faxNumber}
                  onChangeText={text => this.props.doctor.practice.faxNumber = text}
                />
                <TextInput
                  style={styles.textBox}
                  placeholder='Address Line 1'
                  placeholderTextColor={Colors.MEDIUM_BLUE}
                  defaultValue={this.props.doctor.practice.addressLine1}
                  onChangeText={text => this.props.doctor.practice.addressLine1 = text}
                />
                <TextInput
                  style={styles.textBox}
                  placeholder='Address Line 2'
                  placeholderTextColor={Colors.MEDIUM_BLUE}
                  defaultValue={this.props.doctor.practice.addressLine2}
                  onChangeText={text => this.props.doctor.practice.addressLine2 = text}
                />
                <TextInput
                  style={styles.textBox}
                  placeholder='City'
                  placeholderTextColor={Colors.MEDIUM_BLUE}
                  defaultValue={Cities.find(x => x.id == this.props.doctor.practice.city)?.name}
                  onFocus={() => this.setState({isCitySelectModalVisible: true})}
                />
                <TextInput
                  style={styles.textBox}
                  placeholder='State'
                  placeholderTextColor={Colors.MEDIUM_BLUE}
                  defaultValue={States.find(x => x.id == this.props.doctor.practice.state)?.name}
                  onFocus={() => this.setState({isStateSelectModalVisible: true})}
                />
                <TextInput
                  style={styles.textBox}
                  placeholder='Postal Code'
                  placeholderTextColor={Colors.MEDIUM_BLUE}
                  defaultValue={this.props.doctor.practice.postalCode}
                  onChangeText={text => this.props.doctor.practice.postalCode = text}
                />
                <TextInput
                  style={styles.textBox}
                  placeholder='Country'
                  placeholderTextColor={Colors.MEDIUM_BLUE}
                  defaultValue={Countries.find(x => x.id == this.props.doctor.practice.countryCode)?.name}
                  onFocus={() => this.setState({isCountrySelectModalVisible: true})}
                />
                <TouchableOpacity
                  style={styles.textBox}
                  onPress={() => this.onChooseImage()}
                  underlayColor='#fff'>
                  {!this.props.doctor.practice.imageUrl && (
                    <Text style={styles.textBoxText}>Choose an account image</Text>
                  )}
                  {this.props.doctor.practice.imageUrl && (
                    <Image
                      source={{ uri: this.props.doctor.practice.imageUrl }}
                      style={styles.image}
                    />
                  )}
                </TouchableOpacity>
              </View>
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
            visible={this.state.isCitySelectModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <CustomSafeAreaView>
              <ModelHeader titleText="Select" onCancelButtonPress={() => this.setState({isCitySelectModalVisible: false})} />
              <FlatList
                data={Cities}
                keyExtractor={item => item.id}
                renderItem={({item, index, separators}) => (
                  <TouchableHighlight
                    style={styles.option}
                    onPress={() => this.onCityOptionSelected(item)}
                    onShowUnderlay={separators.highlight}
                    onHideUnderlay={separators.unhighlight}>
                    <Text style={styles.optionText}>{item.name}</Text>
                  </TouchableHighlight>
                )}
                ItemSeparatorComponent={({highlighted}) => (<View style={styles.optionSeparator} />)}
              />
            </CustomSafeAreaView>
          </Modal>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.isStateSelectModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <CustomSafeAreaView>
              <ModelHeader titleText="Select" onCancelButtonPress={() => this.setState({isStateSelectModalVisible: false})} />
              <FlatList
                data={States}
                keyExtractor={item => item.id}
                renderItem={({item, index, separators}) => (
                  <TouchableHighlight
                    style={styles.option}
                    onPress={() => this.onStateOptionSelected(item)}
                    onShowUnderlay={separators.highlight}
                    onHideUnderlay={separators.unhighlight}>
                    <Text style={styles.optionText}>{item.name}</Text>
                  </TouchableHighlight>
                )}
                ItemSeparatorComponent={({highlighted}) => (<View style={styles.optionSeparator} />)}
              />
            </CustomSafeAreaView>
          </Modal>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.isCountrySelectModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <CustomSafeAreaView>
              <ModelHeader titleText="Select" onCancelButtonPress={() => this.setState({isCountrySelectModalVisible: false})} />
              <FlatList
                data={Countries}
                keyExtractor={item => item.id}
                renderItem={({item, index, separators}) => (
                  <TouchableHighlight
                    style={styles.option}
                    onPress={() => this.onCountryOptionSelected(item)}
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

  onCityOptionSelected(option) {
    this.props.doctor.practice.city = option.id;
    this.setState({isCitySelectModalVisible: false});
  }

  onStateOptionSelected(option) {
    this.props.doctor.practice.state = option.id;
    this.setState({isStateSelectModalVisible: false});
  }

  onCountryOptionSelected(option) {
    this.props.doctor.practice.countryCode = option.id;
    this.setState({isCountrySelectModalVisible: false});
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
            this.props.doctor.practice.imageUrl = imageUrl;
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
    var practice = this.props.doctor.practice;
    if (!practice.name || practice.name.length <= 2 || practice.name.length >= 30) {
      errorMessage = 'Name must be between 2 and 30 characters.';
    } else if (!practice.description || practice.description.length <= 2 || practice.description.length >= 1000) {
      errorMessage = 'Description must be between 2 and 1000 characters.';
    } else if (!emailAddressRegex.test(practice.emailAddress)) {
      errorMessage = 'Valid email address is required.';
    } else if (isNaN(practice.phoneNumber)) {
      errorMessage = 'A fully numberic phone number is required.';
    } else if (!practice.addressLine1 || practice.addressLine1.length <= 2 || practice.addressLine1.length >= 50) {
      errorMessage = 'Description must be between 2 and 50 characters.';
    } else if (!practice.city) {
      errorMessage = 'City is required.';
    } else if (!practice.state) {
      errorMessage = 'State is required.';
    } else if (isNaN(practice.postalCode)) {
      errorMessage = 'A fully numberic postal code is required.';
    } else if (!practice.countryCode) {
      errorMessage = 'Country is required.';
    }
    await this.setState({ errorMessage: errorMessage });
  }

  async save() {
    var practice = this.props.doctor.practice;
    var body = {
      name: practice.name,
      description: practice.description,
      website: practice.website,
      emailAddress: practice.emailAddress,
      phoneNumber: practice.phoneNumber,
      faxNumber: practice.faxNumber,
      addressLine1: practice.addressLine1,
      addressLine2: practice.addressLine2,
      city: practice.city,
      state: practice.state,
      postalCode: practice.postalCode,
      countryCode: practice.countryCode,
      latitude: practice.latitude,
      longitude: practice.longitude,
      imageUrl: practice.imageUrl
    };
    return fetch('http://www.docmeapp.com/doctor/' + this.props.doctor.id + '/update/practice', {
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

export default connect(mapStateToProps)(EditPracticeScreen);