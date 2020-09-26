# DOCme mobile/web app

The mobile/web application for the DOCme platform. Built with React Native.

## Requirements

For local development, at a minimum you will need a macOS machine to build/run the app for iOS. To build/run for Android, macOS, Windows, or Linux can be used.

## Getting started

Follow the [React Native "Getting Started" instructions](http://reactnative.dev/docs/getting-started):
- Select the **"React Native CLI Quickstart"** option
- Select your **"Development OS"**: macOS, Windows, or Linux
- Select your **"Target OS"**: iOS or Android
- Follow the instructions to install/setup the dependencies

## Install
    $ npm install

## Configure environment variables

Copy the file `.env.example` to a new file named `.env` and then edit it with the environment specific settings. This new file will be ignored by Git (don't need to ever commit).
The variables you will need are:

- Google API key (for geocoding)
- AWS access key ID
- AWS access key secret

## Running the project
    $ npx react-native run-ios
OR
    
    $ npx react-native run-android
* A file called  **launchPackager.command** should be automatically opened in a command window to run Metro (if it gets opened in a text editor you'll need to run in manually).

## Build for production

### iOS
Archive and upload through XCode; make sure you have the required certs and provisioning profiles on your machine

### Android 
Run the following:
    
    $ cd android
    $ ./gradlew bundleRelease

Make sure you have the required private signing cert on your machine and is pointed to in the local gradle properties file.
More instructions are are in the React Native ["Publishing to Google Play Store" documentation](http://reactnative.dev/docs/signed-apk-android).
