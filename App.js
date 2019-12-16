import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Colors from './Constants/Colors';
import SearchScreen from './Screens/SearchScreen';
import AppointmentsScreen from './Screens/AppointmentsScreen';
import LoadingScreen from './Screens/LoadingScreen';
import Icon from 'react-native-ionicons';

const SearchScreenStackNavigator = createStackNavigator(
  {
    SearchScreen: SearchScreen
  },
  {
    navigationOptions: {
      title: 'Search',
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        return <Icon style={[styles.tabIcon, focused ? styles.tabIconFocused : styles.tabIconNormal ]} name="eye" />;
      }
    }
  }
);
const AppointmentsScreenStackNavigator = createStackNavigator(
  {
    AppointmentsScreen: AppointmentsScreen
  },
  {
    navigationOptions: {
      title: 'Appointments',
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        return <Icon style={[styles.tabIcon, focused ? styles.tabIconFocused : styles.tabIconNormal ]} name="calendar" />;
      }
    }
  }
);
const BottomTabNavigator = createBottomTabNavigator(
  {
    SearchScreenStackNavigator: SearchScreenStackNavigator,
    AppointmentsScreenStackNavigator: AppointmentsScreenStackNavigator,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({

    }),
    tabBarOptions: {
      activeTintColor: '#4f4f4f',
      inactiveTintColor: '#4f4f4f'
    }
  }
);
const AppContainer = createAppContainer(
  createSwitchNavigator(
    {
      LoadingScreen: LoadingScreen,
      BottomTabNavigator: BottomTabNavigator
    },
    {
      initialRouteName: 'LoadingScreen'
    }
  )
);

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
};

const styles = StyleSheet.create({
  tabIcon: {
    padding: 5
  },
  tabIconNormal: {
    color: Colors.DARK_GRAY
  },
  tabIconFocused: {
    color: Colors.LIGHT_BLUE
  },
  logoText: {
    width: 200,
    alignSelf: 'center',
    resizeMode: 'contain'
  }
});
