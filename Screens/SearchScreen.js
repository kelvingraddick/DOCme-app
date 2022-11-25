import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, Text, Image, TextInput, TouchableOpacity, TouchableHighlight, Modal, FlatList, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
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
    selectedInsuranceCarrierOption: {},
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

  onInsuranceSelected(options) {
    if (options) {
      this.setState({selectedInsuranceCarrierOption: options.insuranceCarrierOption});
      this.setState({selectedInsurancePlanOption: options.insurancePlanOption});
    }
  }

  async onInsuranceTextBoxFocused() {
    var that = this;
    this.props.navigation.navigate(
      'InsuranceScreen',
      {
        insuranceCarrierOption: this.state.selectedInsuranceCarrierOption,
        insurancePlanOption: this.state.selectedInsurancePlanOption,
        onInsuranceSelected: (options) => { that.onInsuranceSelected(options); }
      }
    );
  }

  onFindButtonTapped() {
    this.props.navigation.navigate(
      'ResultsScreen',
      {
        specialtyId: this.state.selectedSpecialtyOption.id,
        postalCode: this.state.postalCode,
        insurancePlanId: this.state.selectedInsurancePlanOption.id
      }
    );
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
            <TouchableOpacity style={styles.fieldContainer} onPress={() => this.onInsuranceTextBoxFocused()}>
              <TextInput
                style={[styles.textBox, {flex: 1, marginRight: 10}]}
                placeholder='Insurance carrier and plan'
                placeholderTextColor={Colors.MEDIUM_BLUE}
                value={
                  this.state.selectedInsuranceCarrierOption.name && this.state.selectedInsurancePlanOption.name ? 
                    this.state.selectedInsuranceCarrierOption.name + ' · ' + this.state.selectedInsurancePlanOption.name :
                    ''
                }
                onFocus={() => this.onInsuranceTextBoxFocused()}
              />
              <View
                style={styles.fieldButton}
                underlayColor='#fff'>
                <Text style={styles.fieldButtonText}><Icon name="camera" /></Text>
              </View>
            </TouchableOpacity>
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