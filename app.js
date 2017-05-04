import React from 'react';
import {
	AppRegistry,
	Text,
	View,
	StyleSheet,
	DatePickerIOS,
	TouchableHighlight,
	ListView,
	Platform,
	Alert,
	Image
} from 'react-native';
import { Thumbnail, Grid, Col, Row, Container, Header, Content, Form, Item, Input, Label, Left, Right, Body, Icon, Title, InputGroup, List, ListItem } from 'native-base';
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

class WelcomeScreen extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			email: "",
			password: "",
			response: ""
		};

		this.signup = this.signup.bind(this);
		this.login = this.login.bind(this);
		this.navigate = this
	}

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

	async signup() {
		const { navigate } = this.props.navigation;

		try {
			await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password);

			console.log("Account created with " + this.state.email);

			let newUid = firebase.a

			firebaseApp.database().ref('users/' + firebase.auth().currentUser.uid).set({
				email: this.state.email
			});

			// Navigate to the Complete page, the user is auto logged in
			navigate('Complete', { });

			} catch (error) {
				// TODO WAQA link this to functionality
				Alert.alert(
            		error.toString(),
            		null,
            		[
		              {text: 'Forgot Password?', onPress: () => console.log('Forgot Password?')},
		              {text: 'Login', onPress: () => console.log('Login')},
		              {text: 'Signup', onPress: () => console.log('Signup')},
		            ]
		         )
				console.log(error.toString())
		}


	}

	async login() {

		const { navigate } = this.props.navigation;

		try {
			await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);

			console.log("Logged In!" + firebase.auth().currentUser.uid);

			// Navigate to the Home page
			navigate('Search', { });

		} catch (error) {
			// TODO WAQA link this to functionality
			Alert.alert(
				error.toString(),
				null,
				[
				  {text: 'Forgot Password?', onPress: () => console.log('Forgot Password?')},
				  {text: 'Login', onPress: () => console.log('Login')},
				  {text: 'Signup', onPress: () => console.log('Signup')},
				]
			 )
			console.log(error.toString())
		}

	}

	render() {
		const { navigate } = this.props.navigation;
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
			    console.log(user.uid);
				navigate('Search', { });
		  	} else {
			    console.log("no user");
		  	}
		});
		return (
			<View style={styles.container}>
				<Text style={{color:"white", fontSize:65, textAlign:"center", letterSpacing:2.5, fontWeight:'800', fontFamily:"Jaapokki subtract"}}>CHARTER</Text>
				<Content style={{ width: '80%', marginLeft: '9%'}}>
					<Form>
						<Item floatingLabel>
							<Label style={{color:"#DDDDDD"}}>Username</Label>
							<Input
								style={{color:"#DDDDDD"}}
								onChangeText={(email) => this.setState({email})}
								keyboardType="email-address"
                autoCapitalize="none" />
						</Item>
						<Item floatingLabel>
							<Label style={{color:"#DDDDDD"}}>Password</Label>
							<Input
								style={{color:"#DDDDDD"}}
								onChangeText={(password) => this.setState({password})}
                password={true}
                autoCapitalize="none"/>
						</Item>
					</Form>
				</Content>
				<TouchableHighlight style={styles.button} onPress={this.signup} underlayColor='#e2d662'>
					<Text style={styles.buttonText}>SIGN UP</Text>
				</TouchableHighlight>

				<TouchableHighlight style={styles.button} onPress={this.login} underlayColor='#e2d662'>
					<Text style={styles.buttonText}>LOG IN</Text>
				</TouchableHighlight>
			</View>
		);
	}
}

class CompleteScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			// TODO WAQA photos
			displayName: ""
		};

		this.updateInfo = this.updateInfo.bind(this);
	}

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

	updateInfo() {
		const { navigate } = this.props.navigation;

		var user = firebase.auth().currentUser;
		user.updateProfile({
			displayName: this.state.displayName
		}).then(function() {
			console.log(user.displayName)
			firebaseApp.database().ref('users/' + user.uid + '/name').set(
				user.displayName
			);
			navigate('SearchScreen', {});
		}, function(error) {
			console.log("ERROR")
		});
	}

	render() {
		// const { navigate } = this.props.navigation;
		const { params } = this.props.navigation.state;

		return (
			<View style={styles.container}>
				<Text style={{color:"white", fontSize:65, textAlign:"center", letterSpacing:2.5, fontWeight:'800', fontFamily:"Jaapokki subtract"}}>CHARTER</Text>
				<Content style={{ width: '80%', marginLeft: '9%'}}>
					<Form>
						<Item floatingLabel>
							<Label style={{color:"#DDDDDD"}}>Name</Label>
							<Input
								style={{color:"#DDDDDD"}}
								onChangeText={(displayName) => this.setState({displayName})} />
						</Item>
					</Form>
				</Content>
				<TouchableHighlight style={styles.button} onPress={this.updateInfo} underlayColor='#e2d662'>
					<Text style={styles.buttonText}>COMPLETE SIGN UP</Text>
				</TouchableHighlight>
			</View>
		);
	}

}

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

				<TouchableHighlight style={styles.button} onPress={() => navigate('List', { })} underlayColor='#e2d662'>
					<Text style={styles.buttonText}>SEARCH</Text>
				</TouchableHighlight>
				<TouchableHighlight style={styles.button} onPress={() => navigate('Create', { })} underlayColor='#e2d662'>
					<Text style={styles.buttonText}>CREATE</Text>
				</TouchableHighlight>
			</View>


		);
	}
}

class ListScreen extends React.Component {
	static navigationOptions = {
		// Nav options can be defined as a function of the navigation prop:
		title: ({ state }) => `Available Charters`,
		//for ${state.params.user}
	};

	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2,
			})
		};
		this.getDestination = this.getDestination.bind(this);
	}

	listenForCharters(chartersRef) {
		chartersRef.on('value', (snap) => {

			// get children as an array
			var list_charters = [];
			snap.forEach((child) => {
				list_charters.push(child.key);
			});
			// console.log(list_charters);

			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(list_charters)
			});

		});
	}

	getDestination(charterId) {
		console.log(charterId);
		var destination = " ";
		firebase.database().ref('charters/' + charterId).once('value').then((snapshot) => {
			destination = snapshot.val().destination;
		});
		console.log(destination);
		return destination;
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
			<Content style={{ marginTop: '7.5%' }} >
			<Grid>
			<Row>
			<ListView
				dataSource={this.state.dataSource}
				renderRow={(rowData) => <Text>{this.getDestination(rowData).destination}</Text>}
			/>

			</Row>
			</Grid>

			</Content>
			<TouchableHighlight style={styles.button} onPress={() => navigate('Create', { user: 'Christopher Eisgruber' })} underlayColor='#e2d662'>
					<Text style={styles.buttonText}>CREATE NEW RIDE</Text>
			</TouchableHighlight>
			</Container>
		);
	}

}

class DetailScreen extends React.Component {
	static navigationOptions = {
		// Nav options can be defined as a function of the navigation prop:
		title: ({ state }) => `Ride Details`,
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

	join() {
		firebaseApp.database().ref('charters/' + charterID + '/riders/' + currentUser).set(true);
		firebaseApp.database().ref('users/' + currentUser + '/charters-joined/' + charterID).set(true);
	}

	render() {
		// The screen's current route is passed in to `props.navigation.state`:
		const { params } = this.props.navigation.state;
		const { navigate } = this.props.navigation;

		return (
			<Container backgroundColor='#EFF0F0'>
			<Content>

			<View>
			<Image  style={{width: 420, height: 220, flex: 1, justifyContent: 'center', alignItems: 'center'}}
              	source={require('./nyc.jpg')}
              />

              <ListItem>
			<Left><Text style={styles.bodyText}>Destination</Text></Left>
			<Left><Text note>Departure Time, Pickup Location</Text></Left>
			 </ListItem>

            <ListItem avatar>
		       <Left><Thumbnail source={require('./one.jpg')} /></Left>
		    	<Body>
		    		<Text style={{fontWeight: 'bold', fontSize: 15}}>Waqa Islam </Text>
		    	</Body>
		    </ListItem>



			<Text style={styles.bodyText}>Current Riders:</Text>

			</View>

		    <ListItem avatar>
		                <Left>
		                    <Thumbnail source={require('./two.jpg')} />
		                </Left>
		                <Body>
		                	<Text> Kelly Zhou </Text>
		                </Body>
		    </ListItem>
		    <ListItem avatar>
		                <Left>
		                    <Thumbnail source={require('./three.jpg')} />
		                </Left>
		                <Body>
		                	<Text> Matt Rosen </Text>
		                </Body>
			</ListItem>

			</Content>
			<TouchableHighlight style={styles.button} onPress={this.join} underlayColor='#e2d662'>
					<Text style={styles.buttonText}>JOIN RIDE</Text>
			</TouchableHighlight>
			</Container>


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

	onPress() {
		const { navigate } = this.props.navigation;
		var value = this.refs.form.getValue();
		var newCharterKey = firebase.database().ref('charters/').push().key;

		var newCharterData = {
			id: newCharterKey,
			destination: value.destination,
			owner: firebase.auth().currentUser.uid,
			pickup: value.pickup,
			time: value.time.toString(),
			timeline: { m1: 'Welcome to your new Charter! Use this timeline to post any updates.' }
		}

		firebase.database().ref('charters/' + newCharterKey).set(newCharterData);

		firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/charters-owned/' + newCharterKey).set(true);
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
	bodyText: {
  		fontSize: 20,
  		fontWeight: 'bold',
		color: '#2C3440'
	},

});

const Charter = StackNavigator({
	Signup: { screen: WelcomeScreen },
	Complete: { screen: CompleteScreen },
	List:   { screen: ListScreen   },
	Search: { screen: SearchScreen },
	Detail: { screen: DetailScreen },
	Create: { screen: CreateScreen },
}, {
      headerMode: 'screen'
});



AppRegistry.registerComponent('Charter', () => Charter);
