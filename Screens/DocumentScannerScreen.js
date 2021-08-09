import React, { Component } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import DocumentScanner from "react-native-document-scanner";
import Colors from '../Constants/Colors';

export default class DocumentScannerScreen extends Component {
  static navigationOptions = {
    title: 'Scan your insurance card'
  };

  state = { };

  async onDocumentScanned(document) {
    this.props.navigation.state.params.onDocumentScanned(document);
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
            detectionCountBeforeCapture={20}
            overlayColor="rgba(11,117,193,0.7)"
            onPictureTaken={(document) => this.onDocumentScanned(document)}
            onPermissionsDenied={() => console.info("Permissions Denied")}
          />
        </View>
      </>
    );
  }

  componentDidMount() {
    setTimeout(() => {
      this.scanner.capture();
    }, 3000)
  }
};

const styles = StyleSheet.create({
  logoText: {
    height: 45,
    width: 100,
    marginTop: -11,
    resizeMode: 'contain'
  },
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY
  },
  documentScanner: {
    flex: 1
  }
})