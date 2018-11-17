import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text, View, Image } from 'react-native';
import axios from 'axios';
import timer from 'react-native-timer';

import Camera from './Camera';
import { getTranslatedText } from './AxiosServiceHelper';
// import OneSignal from 'react-native-onesignal';
// Import package from node modules
import packageJSON from '../package.json';

import Response from './Response';

import AnimatedSelect from './AnimatedSelect';

// Endpoints
const cloudVision = `https://vision.googleapis.com/v1/images:annotate?key=${
  packageJSON.cloudAPI
}`;
const translateApi = `https://translation.googleapis.com/language/translate/v2?key=${
  packageJSON.cloudAPI
}`;

export { default } from './MainScreen';

export class main extends Component<void, *, void> {
  constructor(props) {
    super(props);
    this.state = {
      captureText: '...',
      targetLanguage: 'de',
      activeIndex: 0,
      count: 0,
    };
    this.takePicture = this.takePicture.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
    timer.setInterval(this, 'takePicture', () => this.takePicture(), 1000);
    timer.setInterval(this, 'clearInterval', () => this.clearInterval(), 30000);
  }
  componentWillUnmount() {
    timer.clearInterval(this);
  }
  changeLanguage({ activeIndex, targetLanguage }) {
    this.setState({
      activeIndex,
      targetLanguage,
      captureText: '',
      done: false,
    });
  }
  async clearInterval() {
    timer.clearInterval(this);
    this.setState({
      done: true,
      captureText: '',
    });
  }
  async takePicture() {
    const self = this;
    const image64 = await this.camera.capture();
    const captureText = await getTranslatedText(
      cloudVision,
      this.state.targetLanguage,
      image64,
    );

    if (!this.state.done) {
      this.setState({ captureText });
    }
  }

  render() {
    return (
      <Camera
        setCam={cam => {
          this.camera = cam;
        }}
      >
        {!this.state.done && this.state.toggleLogoVisibility && (
          <Image
            style={[styles.imageOnAir]}
            source={require('../assets/onair.png')}
          />
        )}
        <Response>
          {!this.state.done && (
            <Text style={styles.descriptionText}>{this.state.captureText}</Text>
          )}
        </Response>
        {!this.state.done && (
          <View style={styles.selectorContainer}>
            <AnimatedSelect
              changeLanguage={this.changeLanguage}
              activeIndex={this.state.activeIndex}
            />
          </View>
        )}
      </Camera>
    );
  }
}

const styles = StyleSheet.create({
  descriptionText: {
    elevation: 1,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'yellow',
  },
  image: {
    opacity: 0.9,
    height: 300,
    width: 350,
  },
  imageOnAir: {
    position: 'absolute',
    top: 100,
    width: 60,
    opacity: 0.3,
    height: 40,
    left: Dimensions.get('window').width / 2 - 30,
  },
  version: {
    color: 'yellow',
    fontSize: 12,
    position: 'absolute',
    top: 0,
    opacity: 0.7,
    right: 10,
  },
  time: {
    color: 'yellow',
    fontSize: 36,
    padding: 22,
    alignSelf: 'center',
    textAlign: 'center',
  },
  notification: {
    color: 'yellow',
    fontSize: 16,
    alignSelf: 'center',
    padding: 22,
  },
  cloudLogo: {
    position: 'absolute',
    top: 0,
    width: 160,
    height: 100,
    left: Dimensions.get('window').width / 2 - 80,
    opacity: 0.6,
  },
  selectorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
  },
});
