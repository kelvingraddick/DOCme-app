import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, Text, Image, TextInput, TouchableOpacity, TouchableHighlight, Modal, FlatList, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import vision from '@react-native-firebase/ml-vision';
import DateTimePicker from '@react-native-community/datetimepicker';
import Moment from 'moment';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import ModelHeader from '../Components/ModalHeader';
import CustomSafeAreaView from '../Components/CustomSafeAreaView';
import Icon from 'react-native-ionicons';

class LogoTitle extends React.Component {
  render() {
    return (<Image style={styles.logoText} source={require('../Images/docme-logo-icon-and-text.png')} />);
  }
}

export default class SearchScreen extends Component {
  static navigationOptions = {
    headerTitle: () => <LogoTitle />,
    headerBackTitle: "",
    headerTruncatedBackTitle: ""
  };

  state = {
    isSpecialtySearchModalVisible: false,
    specialtyOptions: [],
    selectedSpecialtyOption: {},
    postalCode: null,
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

    this.setState({insurancePlanOptions: insurancePlans});
  }

  onInsurancePlanOptionSelected(option) {
    this.setState({selectedInsurancePlanOption: option});
    this.setState({isInsurancePlanSearchModalVisible: false});
  }

  async onCameraButtonTapped() {
    var that = this;
    this.props.navigation.navigate('DocumentScannerScreen', { onDocumentScanned: (document) => { that.onDocumentScanned(document); } });
  }

  async onDocumentScanned(document) {
    this.setState({ isLoading: true });

    if (document.croppedImage) {
      const recognizedText = await vision().textRecognizerProcessImage(document.croppedImage);
      var terms = this.getTermsFromRecognizedText(recognizedText);

      var insuranceCarriers = await this.getInsuranceCarriersFromTerms(terms);
      var insuranceCarrier = insuranceCarriers[0];
      if (insuranceCarrier) {
        this.setState({insuranceCarrierOptions: insuranceCarriers});
        this.setState({selectedInsuranceCarrierOption: insuranceCarrier});

        var insurancePlans = await this.getInsurancePlansFromTerms(insuranceCarrier,terms);
        var insurancePlan = insurancePlans[0];
        if (insurancePlan) {
          this.setState({insurancePlanOptions: insurancePlans});
          this.setState({selectedInsurancePlanOption: insurancePlan});
        }
      }
    }

    this.setState({ isLoading: false });
  }

  getTermsFromRecognizedText(recognizedText) {
    var terms = [];
    for (var i = 0; i < recognizedText.blocks.length; i++) {
      var term = recognizedText.blocks[i].text;
      if (isNaN(term) && term.length > 3 && term !== 'plan') {
        term = term.replace(/\W/g, ',').replace(' ', '');
        if (term && term != '') {
          terms.push(term.replace(/\W/g, ',').replace(' ', ''));
        }
      }
    }
    return terms.filter(Boolean).join(',');
  }

  async getInsuranceCarriersFromTerms(terms) {
    return await fetch('http://www.docmeapp.com/insurance/carriers/card/?terms=' + encodeURIComponent(terms), { method: 'GET' })
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
  }

  async getInsurancePlansFromTerms(insuranceCarrier, terms) {
    return await fetch('http://www.docmeapp.com/insurance/carrier/' + (insuranceCarrier && insuranceCarrier.id) + '/plans/card/?terms=' + encodeURIComponent(terms), { method: 'GET' })
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
  }

  onFindButtonTapped() {
    this.props.navigation.navigate('ResultsScreen', { specialtyId: this.state.selectedSpecialtyOption.id, postalCode: this.state.postalCode, insurancePlanId: this.state.selectedInsurancePlanOption.id });
  }

  render() {
    return (
      <>
        <StatusBar barStyle='dark-content' />
        <CustomSafeAreaView>
        <KeyboardAwareScrollView style={styles.container}>
          <Image style={styles.backgroundImage} source={require('../Images/background-1.jpg')} />
          <View style={styles.header}>
            <Text style={styles.titleText}>Welcome to DOCme!{'\n'}Tell us what you need below</Text>
            <TextInput
              style={styles.textBox}
              placeholder='Speciality'
              placeholderTextColor={Colors.MEDIUM_BLUE}
              value={this.state.selectedSpecialtyOption.name}
              onFocus={() => this.setState({isSpecialtySearchModalVisible: true})}
            />
            <TextInput
              style={styles.textBox}
              placeholder='Postal code'
              placeholderTextColor={Colors.MEDIUM_BLUE}
              defaultValue={this.state.postalCode}
              onChangeText={text => this.state.postalCode = text}
            />
            <View style={styles.fieldContainer}>
              <TextInput
                style={[styles.textBox, {flex: 1, marginRight: 10}]}
                placeholder='Insurance carrier'
                placeholderTextColor={Colors.MEDIUM_BLUE}
                value={this.state.selectedInsuranceCarrierOption.name}
                onFocus={() => this.setState({isInsuranceCarrierSearchModalVisible: true})}
              />
              <TouchableOpacity
                style={styles.fieldButton}
                onPress={() => this.onCameraButtonTapped()}
                underlayColor='#fff'>
                <Text style={styles.fieldButtonText}><Icon name="camera" /></Text>
              </TouchableOpacity>
            </View>
            { this.state.selectedInsuranceCarrierOption.id &&
              <TextInput
                style={styles.textBox}
                placeholder='Insurance plan'
                placeholderTextColor={Colors.MEDIUM_BLUE}
                value={this.state.selectedInsurancePlanOption.name}
                onFocus={() => this.setState({isInsurancePlanSearchModalVisible: true})}
              />
            }
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.onFindButtonTapped()}
              underlayColor='#fff'>
                {!this.state.isLoading && (
                  <Text style={styles.buttonText}>Find</Text>
                )}
                {this.state.isLoading && (
                  <ActivityIndicator size="small" color="#ffffff" />
                )}
            </TouchableOpacity>
          </View>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.isSpecialtySearchModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <CustomSafeAreaView>
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
            </CustomSafeAreaView>
          </Modal>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.isInsuranceCarrierSearchModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <CustomSafeAreaView>
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
            </CustomSafeAreaView>
          </Modal>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.isInsurancePlanSearchModalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <CustomSafeAreaView>
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
            </CustomSafeAreaView>
          </Modal>
        </KeyboardAwareScrollView>
        </CustomSafeAreaView>
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
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    height: 300,
    width: null
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
  fieldContainer: {
    flexDirection: 'row'
  },
  fieldButton: {
    color: Colors.WHITE,
    fontSize: 15,
    paddingHorizontal: 17,
    backgroundColor: Colors.HIGH_LIGHT,
    borderRadius: 5,
    marginBottom: 10
  },
  fieldButtonText: {
    color: Colors.DARK_BLUE,
    fontSize: 20,
    lineHeight: 55,
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