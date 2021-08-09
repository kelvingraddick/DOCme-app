import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import DoctorRowView from '../Components/DoctorRowView';

export default class ResultsScreen extends Component {
  state = {
    doctors: []
  };
  
  async componentDidMount() {
    var doctors = await fetch('http://www.docmeapp.com/doctor/search', { method: 'GET' })
    .then((response) => { 
      if (response.status == 200) {
        return response.json()
        .then((responseJson) => {
          if (responseJson.isSuccess) {
            return responseJson.doctors;
          }
        })
      }
      return undefined;
    })
    .catch((error) => {
      console.error(error);
      return undefined;
    });
    this.setState({doctors: doctors});
  }
  
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>  
          <FlatList
            data={this.state.doctors}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => 
              <TouchableOpacity onPress={() => this.props.navigation.navigate('DoctorScreen', { id: item.id })}>
                <DoctorRowView doctor={item} />
              </TouchableOpacity>
            }
          />
        </View>
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  }
})