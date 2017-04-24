import React from 'react';
import {
	AppRegistry,
	Text,
	View,
	StyleSheet,
	DatePickerIOS,
	TouchableHighlight,
	ListView,
	Platform
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
const usersRef = firebaseApp.database().ref().child('users');
var currentUser = 'dudebro';

class LoginScreen extends React.Component {
	static navigationOptions = {
		title: ' ',
		header: {
		    titleStyle: {
		     	color: '#B5BABF',
		     	letterSpacing: 2,
		     	fontWeight: '500'
		    },
		    style: {
		     	backgroundColor: '#092742'
		    },
		    tintColor: {
		      	backgroundColor: '#FCEE6D'
		    }
		  }
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
			<View style={styles.container}>
				<Text style={{color:"white", fontSize:65, textAlign:"center", letterSpacing:2.5, fontWeight:'800', fontFamily:"Jaapokki subtract"}}>CHARTER</Text>
				<Content style={{ width: '80%', marginLeft: '9%'}}>
					<Form >
						<Item floatingLabel>
							<Label style={{color:"#DDDDDD"}}>Username</Label>
							<Input style={{color:"#DDDDDD"}} />
						</Item>
						<Item floatingLabel>
							<Label style={{color:"#DDDDDD"}}>Password</Label>
							<Input secureTextEntry={true} style={{color:"#DDDDDD"}}/>
						</Item>
					</Form>
				</Content>
				<TouchableHighlight style={styles.button} onPress={() => navigate('Search', { })} underlayColor='#e2d662'>
					<Text style={styles.buttonText}>LOG IN</Text>
				</TouchableHighlight>
			</View>
		);
	}
}

///

class SearchScreen extends React.Component {
	static navigationOptions = {
		// Nav options can be defined as a function of the navigation prop:
		title: ({ state }) => ` `,
		header: {
		    titleStyle: {
		     	color: '#B5BABF',
		     	letterSpacing: 2,
		     	fontWeight: '500'
		    },
		    style: {
		     	backgroundColor: '#092742'
		    },
		    tintColor: {
		      	backgroundColor: '#FCEE6D'
		    }
		  }
	};

	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2,
			}),
			textInputValue: ''
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

	onPress() {
		var value = this.refs.form.getValue();
		var start = new Date(value.time);
		chartersRef.orderByChild("destination").equalTo(value.destination).on("value", function(snap) {
			snap.forEach(function(childSnap) {
				var childData = childSnap.val();

				var qstart = new Date(childData.time);
				if ((Math.abs(start - qstart) / 60000) < 30) {
					// DO SOMETHING HERE
				}
			});
		});

	}

	render() {

		const { params } = this.props.navigation.state;
		const { navigate } = this.props.navigation;

		var Destinations = t.enums({
			'PEN': 'Penn Station NY',
			'JFK': 'JFK Airport NY',
			'PHL': 'Philadelphia Airport'
		});

		// here we are: define your domain model
		var newCharter = t.struct({
			destination: Destinations,     // a required string
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
							var d = String(date.toDateString() + ' ' + date.toLocaleTimeString());
							return d.substring(0, d.length - 6).concat(d.substring(d.length - 3, d.length));
						}
					}
				}
			},

		}; // optional rendering options (see documentation)

		
		return (
			<View style={styles.container}>
				<Text style={{color:"white", fontSize:45, textAlign:"center", letterSpacing:2.5, fontWeight:'800', fontFamily:"Jaapokki subtract"}}>SEARCH</Text>
				<NewCharterForm
					ref="form"
					type={newCharter}
					options={options}
				/>

				<TouchableHighlight style={styles.button} onPress={this.onPress.bind(this)} underlayColor='#e2d662'>
					<Text style={styles.buttonText}>SEARCH</Text>
				</TouchableHighlight>
				<TouchableHighlight style={styles.button} onPress={() => navigate('Create', { })} underlayColor='#e2d662'>
					<Text style={styles.buttonText}>CREATE</Text>
				</TouchableHighlight>
			</View>
			

		);
	}
}


class DetailScreen extends React.Component {
	static navigationOptions = {
		// Nav options can be defined as a function of the navigation prop:
		title: ({ state }) => ` `,
		header: {
		    titleStyle: {
		     	color: '#B5BABF',
		     	letterSpacing: 2,
		     	fontWeight: '500'
		    },
		    style: {
		     	backgroundColor: '#092742'
		    },
		    tintColor: {
		      	backgroundColor: '#FCEE6D'
		    }
		  }
	};
	render() {
		// The screen's current route is passed in to `props.navigation.state`:
		const { params } = this.props.navigation.state;
		return (
			/*<View>
			<Text>Ride details</Text>
			</View>*/
			<View style={styles.container}>
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
			</View>
		);
	}
}

class CreateScreen extends React.Component {
	static navigationOptions = {
		// Nav options can be defined as a function of the navigation prop:
		title: ({ state }) => " ",
		header: {
		    titleStyle: {
		     	color: '#B5BABF',
		     	letterSpacing: 2,
		     	fontWeight: '500'
		    },
		    style: {
		     	backgroundColor: '#092742'
		    },
		    tintColor: {
		      	backgroundColor: '#FCEE6D'
		    }
		  }
	};

	// // TODO this is the logic for joining a charter
	// onPress() {
	// 	firebaseApp.database().ref('charters/' + charterID + '/riders/' + currentUser).set(true);
	// 	firebaseApp.database().ref('users/' + currentUser + '/charters-joined/' + charterID).set(true);
	// }

	onPress() {
		const { navigate } = this.props.navigation;
		var value = this.refs.form.getValue();
		let newCharter = chartersRef.push({
			destination: value.destination,
			owner: currentUser,
			pickup: value.pickup,
			time: value.time.toString(),
			timeline: { m1: 'Welcome to your new Charter! Use this timeline to post any updates.' }
		}).key;

		firebaseApp.database().ref('users/' + currentUser + '/charters-owned/' + newCharter).set(true);
		navigate('Detail', { });
	}

	render() {

		const { params } = this.props.navigation.state;
		const { navigate } = this.props.navigation;

		var Destinations = t.enums({
			'PEN': 'Penn Station NY',
			'JFK': 'JFK Airport NY',
			'PHL': 'Philadelphia Airport'
		});

		var Pickups = t.enums({
			'DIL': 'Dillon Gym',
			'FCC': 'Frist Campus Center',
			'UST': 'U-Store'
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
					label: "Where to?"
				},
				time: {
					label: "When?",
					config: {
						format: (date) => {
							// TODO remove seconds
							return String(date.toDateString() + ' ' + date.toLocaleTimeString());
						}
					}
				}
			}
		}; 

		return (
			<View style={styles.container}>
				<Text style={{color:"white", fontSize:45, textAlign:"center", letterSpacing:2.5, fontWeight:'800', fontFamily:"Jaapokki subtract"}}>CREATE A RIDE</Text>
				<NewCharterForm
					ref="form"
					type={newCharter}
					options={options}
				/>
				<TouchableHighlight style={styles.button} onPress={this.onPress.bind(this)} underlayColor='#e2d662'>
					<Text style={styles.buttonText}>SAVE</Text>
				</TouchableHighlight>
			</View>
		);
	}
}


const styles = StyleSheet.create({
	container: {
		justifyContent: 'center',
		padding: 20,
		backgroundColor: '#0C3458',
		flex: 1,
	},
	title: {
		fontSize: 30,
		alignSelf: 'center',
		marginBottom: 30
	},
	buttonText: {
		fontSize: 15,
		color: '#2C3440',
		//color: 'white',
		alignSelf: 'center',
		fontWeight: 'bold',
		letterSpacing: 2,
	},
	button: {
		height: 36,
		//backgroundColor: '#48BBEC',
		//borderColor: '#48BBEC',
		backgroundColor: '#FCEE6D',
		borderColor: '#FCEE6D',
		borderWidth: 1,
		borderRadius: 8,
		marginBottom: 10,
		alignSelf: 'stretch',
		justifyContent: 'center',

	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},

});

const Charter = StackNavigator({
	Login:  { screen: LoginScreen  },
	Search: { screen: SearchScreen },
	Detail: { screen: DetailScreen },
	Create: { screen: CreateScreen },
}, {
      headerMode: 'screen'
});



AppRegistry.registerComponent('Charter', () => Charter);
