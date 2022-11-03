import React, { Component } from 'react';
import { StyleSheet, View, StatusBar, Text, TouchableOpacity, Alert } from 'react-native';
import DocumentScanner from "react-native-document-scanner";
import Colors from '../Constants/Colors';
import Fonts from '../Constants/Fonts';
import Icon from 'react-native-ionicons';

export default class DocumentScannerScreen extends Component {
  static navigationOptions = {
    title: 'Scan your insurance card'
  };

  state = {
    isLoading: true
  };

  async onDocumentDetected(stableCounter, lastDetectionType) {
    this.setState({isLoading: lastDetectionType < 1 ? false : true });
  }

  async onDocumentScanned(document) {
    if (document && document.rectangleCoordinates) {
      this.props.navigation.state.params.onDocumentScanned(document);
    }
    this.props.navigation.goBack();
  }

  async onCameraButtonTapped() {
    this.scanner.capture();
  }

  async onPermissionsDenied() {
    Alert.alert("Failure!", "Permissions Denied!", [{ text: "OK" }], { cancelable: false });
    this.props.navigation.goBack(); 
  }

  render() {
    return (
      <>
        <StatusBar barStyle='dark-content' />
        <View style={styles.container}>
          <DocumentScanner
            style={styles.documentScanner}
            ref={(ref) => this.scanner = ref}
            useBase64={false}
            saveInAppDocument={true}
            detectionCountBeforeCapture={30}
            overlayColor="rgba(11,117,193,0.7)"
            onRectangleDetect={({ stableCounter, lastDetectionType }) => this.onDocumentDetected(stableCounter, lastDetectionType)}
            onPictureTaken={(document) => this.onDocumentScanned(document)}
            onPermissionsDenied={() => this.onPermissionsDenied()}
          />
          <View>
            <View style={styles.buttonContainer}>
              {!this.state.isLoading && (
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={() => this.onCameraButtonTapped()}
                  underlayColor='#fff'>
                  <Icon name="camera" style={styles.cameraButtonText} />
                </TouchableOpacity>
              )}
              {this.state.isLoading && (
                <View style={styles.disabledButton}>
                  <Icon name="camera" style={styles.disabledButtonText} />
                </View>
              )}
            </View>
          </View>
        </View>
      </>
    );
  }

  componentDidMount() {

  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY
  },
  documentScanner: {
    flex: 1
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  cameraButton: {
    position: "absolute",
    bottom: 30,
    paddingHorizontal: 27,
    backgroundColor: Colors.LIGHT_BLUE,
    borderRadius: 1000,
  },
  cameraButtonText: {
    color: Colors.DARK_BLUE,
    fontSize: 40,
    lineHeight: 80,
    textAlign: 'center'
  },
  disabledButton: {
    position: "absolute",
    bottom: 30,
    paddingHorizontal: 27,
    backgroundColor: Colors.GRAY,
    borderRadius: 1000,
    opacity: 0.5
  },
  disabledButtonText: {
    color: Colors.DARK_GRAY,
    fontSize: 40,
    lineHeight: 80,
    textAlign: 'center'
  },
})