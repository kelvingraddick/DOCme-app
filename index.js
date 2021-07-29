/**
 * @format
 */

import {AppRegistry} from 'react-native';
import OneSignal from 'react-native-onesignal';
import App from './App';
import {name as appName} from './app.json';

//0 = NONE, 1 = FATAL, 2 = ERROR, 3 = WARN, 4 = INFO, 5 = DEBUG, 6 = VERBOSE
OneSignal.setLogLevel(6, 3);
OneSignal.setAppId("f3d9df4f-4173-4a0d-bc05-5bb3af25162e");
OneSignal.promptForPushNotificationsWithUserResponse(response => {
  console.log("OneSignal: prompt response:", response);
});
OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
  console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
  let notification = notificationReceivedEvent.getNotification();
  console.log("OneSignal: notification: ", notification);
  const data = notification.additionalData
  console.log("OneSignal: additionalData: ", data);
  // Complete with null means don't show a notification.
  notificationReceivedEvent.complete(notification);
});
OneSignal.setNotificationOpenedHandler(notification => {
  console.log("OneSignal: notification opened:", notification);
});

AppRegistry.registerComponent(appName, () => App);
