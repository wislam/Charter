/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import * as firebase from 'firebase';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDYEq76HH9bRI1YbhV-Q8_-B5ue7Vyh4-g",
  authDomain: "charter-2d47b.firebaseapp.com",
  databaseURL: "https://charter-2d47b.firebaseio.com",
  storageBucket: "charter-2d47b.appspot.com",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class Charter extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to Charter!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Charter', () => Charter);
