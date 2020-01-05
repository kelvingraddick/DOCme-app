import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View, StatusBar, Text, Image, TextInput, TouchableOpacity, TouchableHighlight, Modal, FlatList } from 'react-native';
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
    selectedSpecialtyOption: {}
  };

  async onSearchBoxChangeText(text) {
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
            />
            <TextInput
              style={styles.textBox}
              placeholder='Date'
              placeholderTextColor={Colors.MEDIUM_BLUE}
            />
            <TextInput
              style={styles.textBox}
              placeholder='Insurance'
              placeholderTextColor={Colors.MEDIUM_BLUE}
            />
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
              onChangeText={(text) => this.onSearchBoxChangeText(text)}
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