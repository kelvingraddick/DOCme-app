import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar, Text, Image, TextInput, TouchableOpacity, TouchableHighlight, Modal, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import ModelHeader from '../Components/ModalHeader';

class LogoTitle extends React.Component {
  render() {
    return (<Image style={styles.logoText} source={require('../Images/docme-logo-icon-and-text.png')} />);
  }
}

export default class SearchScreen extends Component {
  static navigationOptions = {
    headerTitle: () => <LogoTitle />
  };

  state = {
    isSpecialtySearchModalVisible: false,
    specialtyOptions: [],
    selectedSpecialtyOption: {},
    isLocationSearchModalVisible: false,
    locationOptions: [],
    selectedLocationOption: {},
    isDatePickerModalVisible: false,
    selectedDate: {
      value: new Date(),
      display: Moment(new Date()).format("dddd, MMMM Do YYYY")
    },
    isInsuranceCarrierSearchModalVisible: false,
    insuranceCarrierOptions: [],
    selectedInsuranceCarrierOption: {},
    isInsurancePlanSearchModalVisible: false,
    insurancePlanOptions: [],
    selectedInsurancePlanOption: {}
  };

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

  async onLocationSearchBoxChangeText(text) {
    var query = encodeURIComponent(text);
    var apiKey = 'AIzaSyBxibHzVBhbWfOYekruViZrdWLZXbqKZ44';
    var locations = await fetch('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + query + '&key=' + apiKey + '&types=geocode&components=country:us&language=en', { method: 'GET' })
    .then((response) => { 
      if (response.status == 200) {
        return response.json()
        .then((responseJson) => {
          if (responseJson.status == 'OK') {
            return responseJson.predictions;
          }
        })
      }
      return undefined;
    })
    .catch((error) => {
      console.error(error);
      return undefined;
    });

    this.setState({locationOptions: locations});
  }

  onLocationOptionSelected(option) {
    this.setState({selectedLocationOption: option});
    this.setState({isLocationSearchModalVisible: false});
    this.setState({locationOptions: []});
  }

  onDateSelected(event, date) {
    this.setState({selectedDate: { value: date, display: Moment(date).format("dddd, MMMM Do YYYY") }});
  }

  async onInsuranceCarrierSearchBoxChangeText(text) {
    var insuranceCarriers = await fetch('http://www.docmeapp.com/insurance/carriers/search/' + encodeURIComponent(text), { method: 'GET' })
    .then((response) => { 
      if (response.status == 200) {
        return response.json()
        .then((responseJson) => {
          if (responseJson.isSuccess) {
            return responseJson.insuranceCarriers;
          }
        })
      }
      return undefined;
    })
    .catch((error) => {
      console.error(error);
      return undefined;
    });

    this.setState({insuranceCarrierOptions: insuranceCarriers});
  }

  async onInsuranceCarrierOptionSelected(option) {
    this.setState({selectedInsuranceCarrierOption: option});
    this.setState({isInsuranceCarrierSearchModalVisible: false});
    this.setState({insuranceCarrierOptions: []});
    this.setState({selectedInsurancePlanOption: {}});
    this.setState({isInsurancePlanSearchModalVisible: false});
    this.setState({insurancePlanOptions: []});

    this.setState({insurancePlanOptions: []});
    this.setState({selectedInsurancePlanOption: []});

    var insurancePlans = await fetch('http://www.docmeapp.com/insurance/carrier/' + option.id + '/plans', { method: 'GET' })
    .then((response) => { 
      if (response.status == 200) {
        return response.json()
        .then((responseJson) => {
          if (responseJson.isSuccess) {
            return responseJson.insurancePlans;
          }
        })
      }
      return undefined;
    })
    .catch((error) => {
      console.error(error);
      return undefined;
    });

    console.info(insurancePlans);
    this.setState({insurancePlanOptions: insurancePlans});
  }

  onInsurancePlanOptionSelected(option) {
    this.setState({selectedInsurancePlanOption: option});
    this.setState({isInsurancePlanSearchModalVisible: false});
  }

  render() {
    return (
      <>
        <StatusBar barStyle='dark-content' />
        <SafeAreaView />
        <View style={styles.container}>
          <View style={styles.header}>
            <Image style={styles.logoIcon} source={require('../Images/docme-logo-icon.png')} />
            <Text style={styles.titleText}>Welcome to DOCme!{'\n'}Tell us what you need below</Text>
            <TextInput
              style={styles.textBox}
              placeholder='Illness'
              placeholderTextColor={Colors.MEDIUM_BLUE}
              value={this.state.selectedSpecialtyOption.name}
              onFocus={() => this.setState({isSpecialtySearchModalVisible: true})}
            />
            <TextInput
              style={styles.textBox}
              placeholder='Location'
              placeholderTextColor={Colors.MEDIUM_BLUE}
              value={this.state.selectedLocationOption.description}
              onFocus={() => this.setState({isLocationSearchModalVisible: true})}
            />
            <TextInput
              style={styles.textBox}
              placeholder='Date'
              placeholderTextColor={Colors.MEDIUM_BLUE}
              value={this.state.selectedDate.display}
              onFocus={() => this.setState({isDatePickerModalVisible: true})}
            />
            <TextInput
              style={styles.textBox}
              placeholder='Insurance carrier'
              placeholderTextColor={Colors.MEDIUM_BLUE}
              value={this.state.selectedInsuranceCarrierOption.name}
              onFocus={() => this.setState({isInsuranceCarrierSearchModalVisible: true})}
            />
            { this.state.selectedInsuranceCarrierOption.id &&
              <TextInput
                style={styles.textBox}
                placeholder='Insurance plan'
                placeholderTextColor={Colors.MEDIUM_BLUE}
                value={this.state.selectedInsurancePlanOption.name}
                enab
                onFocus={() => this.setState({isInsurancePlanSearchModalVisible: true})}
              />
            }
            <TouchableOpacity
              style={styles.button}
              onPress={() => {}}
              underlayColor='#fff'>
              <Text style={styles.buttonText}>Find</Text>
            </TouchableOpacity>
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
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.isLocationSearchModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <SafeAreaView />
            <ModelHeader titleText="Search" onCancelButtonPress={() => this.setState({isLocationSearchModalVisible: false})} />
            <TextInput
              style={styles.searchBox}
              placeholder='Start typing in a city or zip code..'
              placeholderTextColor={Colors.GRAY}
              onChangeText={(text) => this.onLocationSearchBoxChangeText(text)}
            />
            <FlatList
              data={this.state.locationOptions}
              keyExtractor={item => item.id}
              renderItem={({item, index, separators}) => (
                <TouchableHighlight
                  style={styles.option}
                  onPress={() => this.onLocationOptionSelected(item)}
                  onShowUnderlay={separators.highlight}
                  onHideUnderlay={separators.unhighlight}>
                  <Text style={styles.optionText}>{item.description}</Text>
                </TouchableHighlight>
              )}
              ItemSeparatorComponent={({highlighted}) => (<View style={styles.optionSeparator} />)}
            />
          </Modal>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.isDatePickerModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <SafeAreaView />
            <ModelHeader titleText="Date" onCancelButtonPress={() => this.setState({isDatePickerModalVisible: false})} />
            <View style={{margin: 20}}>
              <DateTimePicker 
                value={this.state.selectedDate.value}
                minimumDate={new Date()}
                mode='date'
                is24Hour={true}
                display='default'
                onChange={(event, date) => this.onDateSelected(event, date)} />
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.setState({isDatePickerModalVisible: false})}
                underlayColor='#fff'>
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.isInsuranceCarrierSearchModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <SafeAreaView />
            <ModelHeader titleText="Search" onCancelButtonPress={() => this.setState({isInsuranceCarrierSearchModalVisible: false})} />
            <TextInput
              style={styles.searchBox}
              placeholder='Start typing in an insurance carrier..'
              placeholderTextColor={Colors.GRAY}
              onChangeText={(text) => this.onInsuranceCarrierSearchBoxChangeText(text)}
            />
            <FlatList
              data={this.state.insuranceCarrierOptions}
              keyExtractor={item => item.id}
              renderItem={({item, index, separators}) => (
                <TouchableHighlight
                  style={styles.option}
                  onPress={() => this.onInsuranceCarrierOptionSelected(item)}
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
            visible={this.state.isInsurancePlanSearchModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <SafeAreaView />
            <ModelHeader titleText="Search" onCancelButtonPress={() => this.setState({isInsurancePlanSearchModalVisible: false})} />
            <FlatList
              data={this.state.insurancePlanOptions}
              keyExtractor={item => item.id}
              renderItem={({item, index, separators}) => (
                <TouchableHighlight
                  style={styles.option}
                  onPress={() => this.onInsurancePlanOptionSelected(item)}
                  onShowUnderlay={separators.highlight}
                  onHideUnderlay={separators.unhighlight}>
                  <Text style={styles.optionText}>{item.name}</Text>
                </TouchableHighlight>
              )}
              ItemSeparatorComponent={({highlighted}) => (<View style={styles.optionSeparator} />)}
            />
          </Modal>
        </View>
      </>
    );
  }
};

const styles = StyleSheet.create({
  logoText: {
    height: 45,
    width: 100,
    marginTop: -11,
    resizeMode: 'contain'
  },
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY
  },
  header: {
    alignContent: 'center',
    padding: 20,
    backgroundColor: Colors.LIGHT_BLUE
  },
  logoIcon: {
    height: 60,
    width: 60,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  titleText: {
    color: Colors.WHITE,
    fontSize: 20,
    fontFamily: Fonts.MEDIUM,
    textAlign: 'center',
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