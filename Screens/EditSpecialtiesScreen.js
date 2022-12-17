import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, StatusBar, Text, TextInput, Alert, FlatList, TouchableHighlight, TouchableOpacity, ActivityIndicator } from 'react-native';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import Actions from '../Constants/Actions';
import Icon from 'react-native-ionicons';

class EditSpecialtiesScreen extends Component {
  static navigationOptions = {
    title: 'Edit Specialties'
  };

  state = {
    errorMessage: null,
    isLoading: false,
    specialtyOptions: [],
    selectedSpecialtyOptionIds: [],
  };

  async componentDidMount() {
    this.state.selectedSpecialtyOptionIds = this.props.doctor.specialties.map(specialty => { return specialty.id; });
    await this.getSpecialtyOptions();
  }

  render() {
    return (
      <>
        <StatusBar barStyle='dark-content' />
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.titleText}>Find and select all your specialties below.</Text>
          </View>
          <TextInput
            style={styles.searchBox}
            placeholder='Type here to filter specialties..'
            placeholderTextColor={Colors.GRAY}
            onChangeText={(text) => this.onSpecialtySearchBoxChangeText(text)}
          />
          <FlatList
            data={this.state.specialtyOptions}
            keyExtractor={item => item.id}
            renderItem={({item, index, separators}) => (
              <TouchableHighlight
                style={styles.option}
                onPress={() => this.onToggleSpecialtyOption(item.id)}
                onShowUnderlay={separators.highlight}
                onHideUnderlay={separators.unhighlight}>
                <>
                  <Text style={styles.optionText}>{item.name}</Text>
                  {this.state.selectedSpecialtyOptionIds.includes(item.id) &&
                    <Icon style={styles.optionSelectedIcon} name='checkmark-circle' />
                  }
                </>
              </TouchableHighlight>
            )}
            ItemSeparatorComponent={({highlighted}) => (<View style={styles.optionSeparator} />)}
          />
          <View style={styles.footer}>
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
      </>
    );
  }

  async getSpecialtyOptions(text) {
    var url = 'http://www.docmeapp.com/specialty/' + ((text && text.length > 0) ? ('search/' + encodeURIComponent(text)) : 'list/');
    var specialties = await fetch(url, { method: 'GET' })
      .then((response) => { 
        if (response.status == 200) {
          return response.json()
          .then((responseJson) => {
            if (responseJson.isSuccess) {
              return responseJson.specialties;
            }
          })
        }
        return [];
      })
      .catch((error) => {
        console.error(error);
        return [];
      });

    this.setState({specialtyOptions: specialties});
  }

  async onSpecialtySearchBoxChangeText(text) {
    await this.getSpecialtyOptions(text);
  }

  async onToggleSpecialtyOption(id) {
    var selectedSpecialtyOptionIds = this.state.selectedSpecialtyOptionIds;
    if (selectedSpecialtyOptionIds.includes(id)) {
      selectedSpecialtyOptionIds = selectedSpecialtyOptionIds.filter(function(value, index, arr){ 
        return value !== id;
      });
    } else {
      selectedSpecialtyOptionIds.push(id);
    }
    this.setState({selectedSpecialtyOptionIds: selectedSpecialtyOptionIds});
  }

  async onSaveButtonTapped() {
    this.setState({ isLoading: true });

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
        "There was an error saving the specialties",
        "Please update entries and try again",
        [{ text: "OK" }],
        { cancelable: false }
      );
      this.setState({ isLoading: false });
    }
  }

  async save() {
    var body = {
      specialtyIds: this.state.selectedSpecialtyOptionIds
    };
    return fetch('http://www.docmeapp.com/doctor/' + this.props.doctor.id + '/update/specialties', {
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
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: Colors.LIGHT_BLUE
  },
  footer: {
    alignContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: Colors.LIGHT_BLUE
  },
  titleText: {
    color: Colors.WHITE,
    fontSize: 17,
    fontFamily: Fonts.MEDIUM
  },
  button: {
    color: Colors.WHITE,
    fontSize: 15,
    padding: 17,
    backgroundColor: Colors.DARK_BLUE,
    borderRadius: 5
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  optionText: {
    padding: 10,
    color: Colors.DARK_BLUE,
    fontSize: 15,
    fontFamily: Fonts.NORMAL
  },
  optionSelectedIcon: {
    padding: 10,
    fontSize: 25,
    color: Colors.GREEN
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

export default connect(mapStateToProps)(EditSpecialtiesScreen);