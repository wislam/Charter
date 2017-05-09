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

var Destinations = {
	PEN: "Penn Station NY",
	JFK: "JFK Airport NY",
	PHL: "Philadelphia Airport"
};

var Pickups = {
	DIL: 'Dillon Gym',
	FCC: 'Frist Campus Center',
	UST: 'U-Store'
};

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
		     	backgroundColor: '#00FFCC'
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
				<Text style={{color:"#00FFCC", fontSize:65, textAlign:"center", letterSpacing:2.5, fontWeight:'800', fontFamily:"oregon"}}>CHARTER</Text>
				<Content style={{ width: '80%', marginLeft: '9%'}}>
					<Form>
						<Item floatingLabel>
							<Label style={{color:"black"}}>Username</Label>
							<Input
								style={{color:"black"}}
								onChangeText={(email) => this.setState({email})}
								keyboardType="email-address"
                autoCapitalize="none" />
						</Item>
						<Item floatingLabel>
							<Label style={{color:"black"}}>Password</Label>
							<Input
								style={{color:"black"}}
								onChangeText={(password) => this.setState({password})}
                password={true}
                autoCapitalize="none"/>
						</Item>
					</Form>
				</Content>
				<TouchableHighlight style={styles.button} onPress={this.signup} underlayColor='#00FFCC'>
					<Text style={styles.buttonText}>SIGN UP</Text>
				</TouchableHighlight>

				<TouchableHighlight style={styles.button} onPress={this.login} underlayColor='#00FFCC'>
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
		     	color: 'black',
		     	letterSpacing: 2,
			fontFamily: "oregon",
		     	fontWeight: '500'
		    },
		    style: {
		     	backgroundColor: '#00FFCC'
		    },
		    tintColor: 'black',
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
			navigate('Search', {});
		}, function(error) {
			console.log("ERROR")
		});
	}

	render() {
		// const { navigate } = this.props.navigation;
		const { params } = this.props.navigation.state;

		return (
			<View style={styles.container}>
				<Text style={{color:"white", fontSize:65, textAlign:"center", letterSpacing:2.5, fontWeight:'800', fontFamily:"oregon"}}>CHARTER</Text>
				<Content style={{ width: '80%', marginLeft: '9%'}}>
					<Form>
						<Item floatingLabel>
							<Label style={{color:"black"}}>Name</Label>
							<Input
								style={{color:"black"}}
								onChangeText={(displayName) => this.setState({displayName})} />
						</Item>
					</Form>
				</Content>
				<TouchableHighlight style={styles.button} onPress={this.updateInfo} underlayColor='#00FFCC'>
					<Text style={styles.buttonText}>COMPLETE SIGN UP</Text>
				</TouchableHighlight>
			</View>
		);
	}

}

class SearchScreen extends React.Component {
	static navigationOptions = {
		// Nav options can be defined as a function of the navigation prop:
		title: ({ state }) => `SEARCH`,
		header: {
		    titleStyle: {
		     	color: 'black',
		     	letterSpacing: 2,
			fontFamily: "oregon",
		     	fontWeight: '500'
		    },
		    style: {
		     	backgroundColor: '#00FFCC'
		    },
		    tintColor: 'black',
		    left: null
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

		this.logout = this.logout.bind(this);
	}

	getRef() {
		return firebaseApp.database().ref();
	}

	async logout() {

		const { navigate } = this.props.navigation;

		try {
			await firebase.auth().signOut();

			console.log("LOGGED OUT!");

			// Navigate to the Home page
			navigate('Welcome', { });

		} catch (error) {
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
		if (value != null) {
			var start = new Date(value.time);
			this.props.navigation.navigate('List', { dest: value.destination, time: start});
		}
		else {
			alert("Please complete the required form items.")
		}
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

				<NewCharterForm
					ref="form"
					type={newCharter}
					options={options}
				/>

				<TouchableHighlight style={styles.button} onPress={this.onPress.bind(this)} underlayColor='#00FFCC'>
					<Text style={styles.buttonText}>SEARCH</Text>
				</TouchableHighlight>
				<TouchableHighlight style={styles.button} onPress={() => navigate('Create', { })} underlayColor='#00FFCC'>
					<Text style={styles.buttonText}>CREATE</Text>
				</TouchableHighlight>
				<TouchableHighlight style={styles.button} onPress={this.logout} underlayColor='#e2d662'>
					<Text style={styles.buttonText}>LOG OUT</Text>
				</TouchableHighlight>
			</View>
		);
	}
}

class ListScreen extends React.Component {
	static navigationOptions = {
		// Nav options can be defined as a function of the navigation prop:
		title: ({ state }) => `Available Charters`,
		header: {
		    titleStyle: {
		     	color: 'black',
		     	letterSpacing: 2,
			fontFamily: "oregon",
		     	fontWeight: '500'
		    },
		    style: {
		     	backgroundColor: '#00FFCC'
		    },
		    tintColor: 'black',
		}
		//for ${state.params.user}
	};

	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2,
			})
		};

	}

	listenForCharters(chartersRef) {

		
		var d = this.props.navigation.state.params.dest;
		var t = this.props.navigation.state.params.time;

		chartersRef.on('value', (snap) => {

			// get children as an array
			var list_charters = [];
			snap.forEach((child) => {
				var qstart = new Date(child.val().time);
				if ((child.val().destination == d) && (qstart.getDate() == t.getDate()) 
					&& (qstart.getMonth() == t.getMonth()) && (qstart.getYear() == t.getYear()))
					list_charters.push(child.val());
			});
			// console.log(list_charters);

			this.setState({
				dataSource: this.state.dataSource.cloneWithRows(list_charters)
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
		<Content style={{ marginTop: '7.5%' }} >
		<Grid>
		<Row>
		<ListView
			dataSource={this.state.dataSource}
			renderRow={(rowData) =>
				<TouchableHighlight style={styles.button} onPress={() => navigate('Detail', { charterId: rowData.id })} underlayColor='#00FFCC'>
					<Text style={styles.buttonText}>{Destinations[rowData.destination]}</Text>
				</TouchableHighlight>}
		/>

		</Row>
		</Grid>

		</Content>
		<TouchableHighlight style={styles.button} onPress={() => navigate('Create', { user: 'Christopher Eisgruber' })} underlayColor='#00FFCC'>
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
		     	color: 'black',
		     	letterSpacing: 2,
			fontFamily: "oregon",
		     	fontWeight: '500'
		    },
		    style: {
		     	backgroundColor: '#00FFCC'
		    },
		    tintColor: 'black',
		}
	};

	constructor(props) {
		super(props);
		this.state = {
			destination: "",
			ownerUid: "",
			pickup: "",
			time: "",
			timeline: [],
			ownerName: "",
			riders: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2,
			})
		};
		ownerUid = "";

		this.componentWillMount = this.componentWillMount.bind(this);
		this.join = this.join.bind(this);
	}

	join() {
		const { params } = this.props.navigation.state;

		console.log(firebase.auth().currentUser.uid);
		console.log(this.state.ownerUid);

		if (firebase.auth().currentUser.uid == this.state.ownerUid) {
			// TODO Make the component for Join conditional so that it only shows up when owner != currentUser
			Alert.alert(
				"You can't join your own trip!",
				null,
				[
				  {text: 'OK', onPress: () => console.log('OK')},
				]
			 )
		}

		firebaseApp.database().ref('charters/' + params.charterId + '/riders/' + firebase.auth().currentUser.uid).set(true);
		firebaseApp.database().ref('users/' + firebase.auth().currentUser.uid + '/charters-joined/' + params.charterId).set(true);
	}

	componentWillMount() {
		const { params } = this.props.navigation.state;

		var currentCharterRef = firebase.database().ref('charters/' + params.charterId);
		currentCharterRef.on('value', (snapshot) => {
			this.ownerUid = snapshot.val().owner;
			this.setState({
				destination: snapshot.val().destination,
			 	ownerUid: snapshot.val().owner,
				pickup: snapshot.val().pickup,
				time: snapshot.val().time,
			});
		});

		var ownerRef = firebase.database().ref('users/' + this.ownerUid);
		ownerRef.on('value', (snapshot) => {
			this.setState({ ownerName: snapshot.val().name });
		});

		list_riders = [];

		firebase.database().ref('charters/' + params.charterId + '/riders').on('value', (snap) => {

			// get children as an array
			snap.forEach((child) => {
				list_riders.push(child.key);
			});

		});

		list_riders_names = [];
		for (x in list_riders) {
			console.log(list_riders[x]);
			firebase.database().ref('users/' + list_riders[x]).on('value', (snap) => {
				list_riders_names.push(snap.val().name);
			});
		}

		console.log(list_riders_names);

		this.setState({
			riders: this.state.riders.cloneWithRows(list_riders_names)
		});
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
				<Left><Text style={styles.bodyText}>{Destinations[this.state.destination]}</Text></Left>
				<Left><Text note>{this.state.time}, {Pickups[this.state.pickup]}</Text></Left>
			 </ListItem>

            <ListItem avatar>
		       <Left><Thumbnail source={require('./one.jpg')} /></Left>
		    	<Body>
		    		<Text style={{fontWeight: 'bold', fontSize: 15}}>{this.state.ownerName}</Text>
		    	</Body>
		    </ListItem>

			<Text style={styles.bodyText}>Current Riders:</Text>

			</View>

			<ListView dataSource={this.state.riders} renderRow={(rowData) =>
				<ListItem avatar>
					<Left><Thumbnail source={require('./two.jpg')} /></Left>
					<Body><Text>{rowData}</Text></Body>
				</ListItem>} />

			</Content>
			<TouchableHighlight style={styles.button} onPress={this.join} underlayColor='#00FFCC'>
					<Text style={styles.buttonText}>JOIN RIDE</Text>
			</TouchableHighlight>
			</Container>


		);
	}
}

class CreateScreen extends React.Component {
	static navigationOptions = {
		// Nav options can be defined as a function of the navigation prop:
		title: ({ state }) => "CREATE A RIDE",
		header: {
		    titleStyle: {
		     	color: 'black',
		     	letterSpacing: 2,
			fontFamily: "oregon",
		     	fontWeight: '500'
		    },
		    style: {
		     	backgroundColor: '#00FFCC'
		    },
		    tintColor: 'black',
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
		navigate('Detail', { charterId: newCharterKey });
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
				<NewCharterForm
					ref="form"
					type={newCharter}
					options={options}
				/>
				<TouchableHighlight style={styles.button} onPress={this.onPress.bind(this)} underlayColor='#00FFCC'>
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
		backgroundColor: 'white',
		flex: 1,
	},
	title: {
		fontSize: 40,
		fontFamily: "oregon",
		color: 'black',
		alignSelf: 'center',
		marginBottom: 30
	},
	buttonText: {
		fontSize: 15,
		color: 'white',
		alignSelf: 'center',
		fontWeight: 'bold',
		letterSpacing: 2,
	},
	button: {
		height: 36,
		backgroundColor: '#307d8e',
		borderColor: '#307d8e',
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
		color: 'black'
	}
});

const Charter = StackNavigator({
	Welcome: { screen: WelcomeScreen },
	Complete: { screen: CompleteScreen },
	List:   { screen: ListScreen   },
	Search: { screen: SearchScreen },
	Detail: { screen: DetailScreen },
	Create: { screen: CreateScreen },
}, {
      headerMode: 'screen'
});



AppRegistry.registerComponent('Charter', () => Charter);
