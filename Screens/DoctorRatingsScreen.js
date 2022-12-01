import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, Text, Image, FlatList } from 'react-native';
import DoctorRowView from '../Components/DoctorRowView';
import Moment from 'moment';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import Icon from 'react-native-ionicons';

export default class DoctorRatingsScreen extends Component {
  static navigationOptions = {
    title: 'Doctor Ratings'
  };

  state = {
    ratings: []
  };

  async componentDidMount() {
    await this.getRatings();
  }
  
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          { this.state.ratings.length > 0 &&
            <View>
              <DoctorRowView doctor={this.state.ratings[0].doctor} />
              <View style={styles.divider}></View>
            </View>
          }
          { this.state.ratings.length > 0 &&
            <FlatList
              data={this.state.ratings}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => 
                <View style={styles.doctorView}> 
                  <Image
                    style={styles.doctorImage}
                    source={{uri: item.patient.imageUrl ? item.patient.imageUrl : ''}}
                  />
                  <View style={styles.doctorDetailsView}>  
                    <Text style={styles.doctorNameText}>{item.patient.firstName} {item.patient.lastName}</Text>
                    <Text style={styles.doctorEmailAddressText}>{Moment(item.timestamp).format('dddd, MMMM Do') + ', ' + Moment(item.timestamp).format('h:mma')}</Text>
                    <View style={styles.doctorStarsView}>  
                      {
                        [1, 2, 3, 4, 5].map((value) =>
                          {
                            let style = item.value && item.value >= value ? styles.greenStarIcon : styles.grayStarIcon;
                            return <Icon style={style} name="star" />
                          }
                        )
                      } 
                    </View>
                    { item.notes &&
                      <Text style={styles.notesText}>"{item.notes && item.notes.trim()}"</Text>
                    }
                  </View>
                </View>
              }
            />
          }
        </View>
      </>
    );
  }

  async getRatings() {
    var ratings = await fetch('http://www.docmeapp.com/rating/doctor/' + this.props.navigation.state.params.doctor.id + '/list/', { method: 'GET' })
    .then((response) => { 
      if (response.status == 200) {
        return response.json()
        .then((responseJson) => {
          if (responseJson.isSuccess) {
            return responseJson.ratings;
          }
        })
      }
      return [];
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
    this.setState({ratings: ratings});
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
  },
  divider: {
    alignSelf: 'stretch',
    borderBottomWidth: 2,
    borderBottomColor: Colors.LIGHT_GRAY,
    marginBottom: 10
  },
  doctorView: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  doctorImage: {
    width: 70,
    height: 70,
    borderRadius: 35
  },
  doctorDetailsView: {
    paddingLeft: 15,
    justifyContent: 'center'
  },
  doctorNameText: {
    color: Colors.DARK_BLUE,
    fontSize: 15,
    fontFamily: Fonts.MEDIUM,
    marginBottom: 3
  },
  doctorEmailAddressText: {
    color: Colors.DARK_BLUE,
    fontSize: 13,
    fontFamily: Fonts.LIGHT,
    marginBottom: 3
  },
  doctorLocationText: {
    color: Colors.GRAY,
    fontSize: 13,
    fontFamily: Fonts.LIGHT,
    marginBottom: 3
  },
  doctorStarsView: {
    flexDirection: 'row',
    marginBottom: 3
  },
  notesText: {
    color: Colors.DARK_GRAY,
    fontSize: 13,
    fontFamily: Fonts.LIGHT,
    marginBottom: 3
  },
  greenStarIcon: {
    color: Colors.GREEN,
    fontSize: 20,
    marginRight: 2
  },
  grayStarIcon: {
    color: Colors.LIGHT_GRAY,
    fontSize: 20,
    marginRight: 2
  }
})