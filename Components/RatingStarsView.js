import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import Icon from 'react-native-ionicons';

export default class RatingStarsView extends Component {
  render() {
    return (
      <View style={styles.container}>  
        {
          [1, 2, 3, 4, 5].map((rating) => {
              let style = this.props.doctor.averageRating && this.props.doctor.averageRating >= rating ? styles.greenStarIcon : styles.grayStarIcon;
              return <Icon style={style} name="star" />
            }
          )
        } 
        <Text style={styles.starText}>({this.props.doctor.numberOfRatings})</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
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
  },
  starText: {
    color: Colors.GRAY,
    fontSize: 13,
    fontFamily: Fonts.NORMAL,
    lineHeight: 20
  }
})