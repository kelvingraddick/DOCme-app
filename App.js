import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import store from './store';
import Colors from './Constants/Colors';
import SearchScreen from './Screens/SearchScreen';
import ResultsScreen from './Screens/ResultsScreen';
import AppointmentsScreen from './Screens/AppointmentsScreen';
import LoadingScreen from './Screens/LoadingScreen';
import DoctorScreen from './Screens/DoctorScreen';
import MyAccountScreen from './Screens/MyAccountScreen';
import Icon from 'react-native-ionicons';

const SearchScreenStackNavigator = createStackNavigator(
  {
    SearchScreen: SearchScreen,
    ResultsScreen: ResultsScreen,
    DoctorScreen: DoctorScreen
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
const MyAccountScreenStackNavigator = createStackNavigator(
  {
    MyAccountScreen: MyAccountScreen
  },
  {
    navigationOptions: {
      title: 'My Account',
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        return <Icon style={[styles.tabIcon, focused ? styles.tabIconFocused : styles.tabIconNormal ]} name="contact" />;
      }
    }
  }
);
const BottomTabNavigator = createBottomTabNavigator(
  {
    SearchScreenStackNavigator: SearchScreenStackNavigator,
    AppointmentsScreenStackNavigator: AppointmentsScreenStackNavigator,
    MyAccountScreenStackNavigator: MyAccountScreenStackNavigator
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
    return <Provider store={store}>
      <AppContainer />
    </Provider>;
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
