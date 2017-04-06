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
	ListView,
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

	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2,
			})
		};
		this.chartersRef = this.getRef().child('charters');

	}

	getRef() {
		console.log(firebaseApp.database().ref());
		return firebaseApp.database().ref();
	}

	listenForCharters(chartersRef) {
		chartersRef.on('value', (snap) => {

			// get children as an array
			var charters = [];
			snap.forEach((child) => {
				charters.push(child.val().destination);
			});

			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(charters)
			});

		});
	}

	componentDidMount() {
		this.listenForCharters(this.chartersRef);
	}

	render() {
		console.log(this.state.dataSource)
		return (
			<View style={{flex: 1, paddingTop: 22}}>
			<Text>DATABASE: </Text>
			<ListView
			dataSource={this.state.dataSource}
			renderRow={(rowData) => <Text>{rowData}</Text>}
			/>
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
