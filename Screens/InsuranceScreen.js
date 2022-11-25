import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, Text, Image, TextInput, TouchableOpacity, TouchableHighlight, Modal, FlatList, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import DocumentScanner from 'react-native-document-scanner-plugin';
import vision from '@react-native-firebase/ml-vision';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import ModelHeader from '../Components/ModalHeader';
import CustomSafeAreaView from '../Components/CustomSafeAreaView';
import Icon from 'react-native-ionicons';

export default class InsuranceScreen extends Component {
  static navigationOptions = {
    title: 'Insurance'
  };

  state = {
    isLoading: false,
    insuranceCardFrontImageSource: null,
    insuranceCardBackImageSource: null,
    isInsuranceCarrierSearchModalVisible: false,
    insuranceCarrierOptions: [],
    selectedInsuranceCarrierOption: this.props.navigation.state.params.insuranceCarrierOption || {},
    isInsurancePlanSearchModalVisible: false,
    insurancePlanOptions: [],
    selectedInsurancePlanOption: this.props.navigation.state.params.insurancePlanOption || {},
  };

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
      return [];
    })
    .catch((error) => {
      console.error(error);
      return [];
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
      return [];
    })
    .catch((error) => {
      console.error(error);
      return [];
    });

    this.setState({insurancePlanOptions: insurancePlans});
  }

  onInsurancePlanOptionSelected(option) {
    this.setState({selectedInsurancePlanOption: option});
    this.setState({isInsurancePlanSearchModalVisible: false});
  }

  async onCameraButtonTapped(isFrontImage) {
    this.setState({ isLoading: true });

    const { scannedImages } = await DocumentScanner.scanDocument({
      maxNumDocuments: 1
    });
    if (scannedImages.length > 0) {
      let imageSource = scannedImages[0];
      
      if (isFrontImage) {
        this.setState({insuranceCardFrontImageSource: imageSource});
      } else {
        this.setState({insuranceCardBackImageSource: imageSource});
      }

      const recognizedText = await vision().textRecognizerProcessImage(imageSource);
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
        return [];
      })
      .catch((error) => {
        console.error(error);
        return [];
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
        return [];
      })
      .catch((error) => {
        console.error(error);
        return [];
      });
  }

  onDoneButtonTapped() {
    this.props.navigation.state.params.onInsuranceSelected({ insuranceCarrierOption: this.state.selectedInsuranceCarrierOption, insurancePlanOption: this.state.selectedInsurancePlanOption });
    this.props.navigation.goBack();
  }

  render() {
    return (
      <>
        <StatusBar barStyle='dark-content' />
        <CustomSafeAreaView>
        <KeyboardAwareScrollView style={styles.container}>
          <Text style={styles.titleText}>Scan the <Text style={{fontWeight: 'bold'}}>front</Text> of your insurance card:</Text>
          <TouchableOpacity style={styles.insuranceCardImageContainer} onPress={() => this.onCameraButtonTapped(true)}>
            { this.state.insuranceCardFrontImageSource &&
              <Image style={styles.insuranceCardImage} source={{ uri: this.state.insuranceCardFrontImageSource }} />
            }
            { !this.state.insuranceCardFrontImageSource &&
              <Icon style={styles.insuranceCardCameraButton} name="camera" />
            }
          </TouchableOpacity>
          <Text style={styles.titleText}>Scan the <Text style={{fontWeight: 'bold'}}>back</Text> of your insurance card:</Text>
          <TouchableOpacity style={styles.insuranceCardImageContainer} onPress={() => this.onCameraButtonTapped(false)}>
            { this.state.insuranceCardBackImageSource &&
              <Image style={styles.insuranceCardImage} source={{ uri: this.state.insuranceCardBackImageSource }} />
            }
            { !this.state.insuranceCardBackImageSource &&
              <Icon style={styles.insuranceCardCameraButton} name="camera" />
            }
          </TouchableOpacity>
          <Text style={styles.titleText}>..or <Text style={{fontWeight: 'bold'}}>manually</Text> search and find</Text>
          <TextInput
            style={[styles.textBox, {flex: 1, marginRight: 10}]}
            placeholder='Insurance carrier'
            placeholderTextColor={Colors.GRAY}
            value={this.state.selectedInsuranceCarrierOption.name}
            onFocus={() => this.setState({isInsuranceCarrierSearchModalVisible: true})}
          />
          { this.state.selectedInsuranceCarrierOption.id &&
            <TextInput
              style={styles.textBox}
              placeholder='Insurance plan'
              placeholderTextColor={Colors.GRAY}
              value={this.state.selectedInsurancePlanOption.name}
              onFocus={() => this.setState({isInsurancePlanSearchModalVisible: true})}
            />
          }
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.onDoneButtonTapped()}
            underlayColor='#fff'>
              {!this.state.isLoading && (
                <Text style={styles.buttonText}>Done</Text>
              )}
              {this.state.isLoading && (
                <ActivityIndicator size="small" color="#ffffff" />
              )}
          </TouchableOpacity>
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
  container: {
    flex: 1,
    alignContent: 'stretch',
    padding: 20,
    paddingTop: 30,
    backgroundColor: Colors.LIGHT_GRAY
  },
  insuranceCardImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 225,
    borderRadius: 5,
    borderColor: Colors.GRAY,
    borderStyle: 'dashed',
    borderWidth: 2,
    marginBottom: 10
  },
  insuranceCardCameraButton: {
    fontSize: 35,
    color: Colors.GRAY
  },
  insuranceCardImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%"
  },
  titleText: {
    color: Colors.DARK_GRAY,
    fontSize: 17,
    lineHeight: 37,
    fontFamily: Fonts.MEDIUM,
    textAlign: 'center'
  },
  textBox: {
    width: null,
    color: Colors.MEDIUM_BLUE,
    fontSize: 15,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 5,
    marginBottom: 20
  },
  button: {
    color: Colors.WHITE,
    fontSize: 15,
    padding: 17,
    backgroundColor: Colors.DARK_BLUE,
    borderRadius: 5,
    marginBottom: 70
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