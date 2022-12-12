import AsyncStorage from '@react-native-community/async-storage';
import OneSignal from 'react-native-onesignal';
import Actions from '../Constants/Actions';

const logoutWithDispatch = async function(dispatch) {
  console.log('Logout: Attempt to logout');
  dispatch({ type: Actions.SET_TOKEN, token: null });
  dispatch({ type: Actions.SET_PATIENT, patient: null });
  dispatch({ type: Actions.SET_DOCTOR, doctor: null });
  await AsyncStorage.removeItem('TOKEN');
  OneSignal.removeExternalUserId((results) => {
    console.log('OneSignal: Results of removing external user id: ' + JSON.stringify(results));
    if (results.push && results.push.success) {
      console.log('OneSignal: Results of removing external user id push status: ' + results.push.success);
    }
  });
}

module.exports = {
  logoutWithDispatch: logoutWithDispatch
};