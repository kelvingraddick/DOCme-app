# DOCme mobile app

The iOS and Android mobile application for the DOCme platform. Built with React Native.

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
    $ cd ios
    $ pod install
    $ cd ..

## Configure environment variables

Copy the file `.env.example` to a new file named `.env` and then edit it with the environment specific settings. This new file will be ignored by Git (don't need to ever commit).
The variables you will need are:

- Google API key (for geocoding)
- AWS access key ID
- AWS access key secret
- Stripe public key
- Stripe product ID
- Stripe success URL
- Stripe cancelled URL

## Running the project

### iOS
You must be using a Mac.
How you run the project for iOS depends on the Mac processor:
- Intel Mac
    - A. Run from Terminal:
        - Run `npx react-native run-ios`
        - This should open Metro in a new Terminal, and open the simulator to run the app
    - B. Run from Xcode:
        - Open the workspace file for the project, and run the app through Xcode
- Apple Silicon (M1/M2) Mac
    - On Apple Silicon Macs you may get an error: *'"launchPackager.command” can’t be opened because (null) is not allowed to open documents in Terminal.'*
    - If so, first you'll need to start Metro by double-clicking to run the `launchPackager.command` file manually, found at `'node_modules' > 'react-native' > 'scripts'`
    - Then open the workspace file for the project, and run the app through Xcode running in Rosetta (Google it)

### Android 
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

## Troubleshooting

### 1. Older version of React-native not showing images on iOS (pods issue)

If you are not running the latest react-native version and not planning to upgrade, then go to:
	`node_modules > react-native > Libraries > Image > RCTUIImageViewAnimated.m` search for  "`if (_currentFrame)`"

..add the following else block to the if block as below:
```
if (_currentFrame) {
    layer.contentsScale = self.animatedImageScale;
    layer.contents = (__bridge id)_currentFrame.CGImage;
} else {
    [super displayLayer:layer];
}
```

Reference :
- https://github.com/facebook/react-native/issues/29279#issuecomment-658244428”
- https://stackoverflow.com/questions/63949851/react-native-ios-not-showing-images-pods-issue 
