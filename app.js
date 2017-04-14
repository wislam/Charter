import React from 'react';
import {
	AppRegistry,
	Text,
	View,
	StyleSheet,
	DatePickerIOS,
	TouchableHighlight,
	ListView
} from 'react-native';
import { Grid, Col, Row, Container, Header, Content, Form, Item, Input, Label, Left, Right, Body, Icon, Title, InputGroup, List, ListItem } from 'native-base';
import {
	Button
} from 'react-native-elements'
import { StackNavigator } from 'react-navigation';
import * as firebase from 'firebase';

// tcomb-form-native
var t = require('tcomb-form-native');
var NewCharterForm = t.form.Form;

// Initialize Firebase
const firebaseConfig = {
	apiKey: "AIzaSyDYEq76HH9bRI1YbhV-Q8_-B5ue7Vyh4-g",
	authDomain: "charter-2d47b.firebaseapp.com",
	databaseURL: "https://charter-2d47b.firebaseio.com",
	storageBucket: "charter-2d47b.appspot.com",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const chartersRef = firebaseApp.database().ref().child('charters');

class LoginScreen extends React.Component {
	static navigationOptions = {
		title: "Charter"
	};
	render() {
		const { navigate } = this.props.navigation;
		return (
			/*<View>
			<Text>Login</Text>
			<Button
			onPress={() => navigate('Search', { user: 'Christopher Eisgruber' })}
			title="Log in"
			/>
			</View>*/
			<Container backgroundColor='#EFF0F0'>
			<Content style={{ width: '80%', marginLeft: '9%'}}>
			<Form >
			<Item floatingLabel>
			<Label>Username</Label>
			<Input />
			</Item>
			<Item floatingLabel >
			<Label>Password</Label>
			<Input secureTextEntry={true}/>
			</Item>
			</Form>
			</Content>
			<Button
			onPress={() => navigate('Search', { user: 'Christopher Eisgruber' })}
			title='LOG IN' fontweight='bold' backgroundColor='#7CD3C8'/>
			</Container>
		);
	}
}



//////////////////

class SearchScreen extends React.Component {
	static navigationOptions = {
		// Nav options can be defined as a function of the navigation prop:
		title: ({ state }) => `Search`,
	};

	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2,
			})
		};
	}

	getRef() {
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
		this.listenForCharters(chartersRef);
	}

	render() {
		// The screen's current route is passed in to `props.navigation.state`:
		const { params } = this.props.navigation.state;
		const { navigate } = this.props.navigation;

		return (
			<Container backgroundColor='#EFF0F0'>
			<Item floatingLabel style={{ width: '80%', marginLeft:'10%', marginTop:'15%', }}>
			<Label>Search</Label>
			<Input />
			</Item>
			<Content style={{ marginTop: '7.5%' }} >
			<Grid>
			<Row>
			<ListView
				dataSource={this.state.dataSource}
				renderRow={(rowData) => <Text style={styles.welcome}>{rowData}</Text>}
			/>

			</Row>
			</Grid>

			</Content>
			<Button raised title='CREATE NEW RIDE' style={{ float:'bottom' }} backgroundColor='#7CD3C8' onPress={() => navigate('Create', { user: 'Christopher Eisgruber' })}/>
			</Container>
		);
	}
}

class ListScreen extends React.Component {
	static navigationOptions = {
		// Nav options can be defined as a function of the navigation prop:
		title: ({ state }) => `Ride listings for ${state.params.user}`,
	};
	render() {
		// The screen's current route is passed in to `props.navigation.state`:
		const { params } = this.props.navigation.state;
		const { navigate } = this.props.navigation;
		return (
			<View>
			<Text>Show more...</Text>
			<Button
			onPress={() => navigate('Detail', { user: 'Christopher Eisgruber' })}
			title="Detail > "
			/>
			<Button
			onPress={() => navigate('Create', { user: 'Christopher Eisgruber' })}
			title="Create New Ride >"
			/>
			</View>
		);
	}
}

class DetailScreen extends React.Component {
	static navigationOptions = {
		// Nav options can be defined as a function of the navigation prop:
		title: ({ state }) => `Details for ride`,
	};
	render() {
		// The screen's current route is passed in to `props.navigation.state`:
		const { params } = this.props.navigation.state;
		return (
			/*<View>
			<Text>Ride details</Text>
			</View>*/
			<Container>
			<Content>
			<Form>
			<Item floatingLabel>
			<Label>Departure Time:</Label>
			<Input />
			</Item>
			<Item floatingLabel last>
			<Label>Estimated Arrival Time:</Label>
			<Input />
			</Item>
			<Item floatingLabel last>
			<Label>Destination:</Label>
			<Input />
			</Item>
			<Item floatingLabel last>
			<Label>Pickup Location:</Label>
			<Input />
			</Item>
			<Item floatingLabel last>
			<Label>Current Riders:</Label>
			<Input />
			</Item>
			</Form>
			</Content>
			</Container>
		);
	}
}

class CreateScreen extends React.Component {
	static navigationOptions = {
		// Nav options can be defined as a function of the navigation prop:
		title: ({ state }) => `Create a new ride`
	};

	onPress() {
		console.log("Saved");
	}
	render() {
		var Destinations = t.enums({ 1: 'Penn Station NY', 2: 'JFK Airport NY', 3: 'Philadelphia Airport' });

		var Pickups = t.enums({
			1: 'Dillon Gym', 2: 'Frist Campus Center', 3: 'U-Store'
		});

		// here we are: define your domain model
		var newCharter = t.struct({
			destination: Destinations,     // a required string
			pickup: Pickups,  		 // an optional string
			time: t.Date               // a required number
		});

		var options = {
			fields: {
				destination: {
					label: 'Where to?'
				},
				time: {
					label: 'When?',
					config: {
						format: (date) => {
							// TODO remove seconds
							return String(date.toDateString() + ' ' + date.toLocaleTimeString());
						}
					}
				}
			}
		}; // optional rendering options (see documentation)
		return (
			<View style={styles.container}>
			<NewCharterForm
			ref="form"
			type={newCharter}
			options={options}
			/>
			<TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor='#99d9f4'>
			<Text style={styles.buttonText}>Save</Text>
			</TouchableHighlight>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		marginTop: 50,
		padding: 20,
		backgroundColor: '#EFF0F0',
	},
	title: {
		fontSize: 30,
		alignSelf: 'center',
		marginBottom: 30
	},
	buttonText: {
		fontSize: 18,
		color: 'white',
		alignSelf: 'center'
	},
	button: {
		height: 36,
		backgroundColor: '#48BBEC',
		borderColor: '#48BBEC',
		borderWidth: 1,
		borderRadius: 8,
		marginBottom: 10,
		alignSelf: 'stretch',
		justifyContent: 'center'
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	}
});

const Charter = StackNavigator({
	Login:  { screen: LoginScreen  },
	Search: { screen: SearchScreen },
	List:   { screen: ListScreen   },
	Detail: { screen: DetailScreen },
	Create: { screen: CreateScreen },
});

AppRegistry.registerComponent('Charter', () => Charter);
