
'use strict';
import React from 'react';
import stripe from 'tipsi-stripe'
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
	Image,
	Switch,
	AlertIOS
} from 'react-native';
var UIExplorerBlock = require('./');
var ReactNative = require('react-native');
var {
  Linking,

  TouchableOpacity,

} = ReactNative;
import { ActionSheet, Separator, Thumbnail, Grid, Col, Row, Container, Header, Content, Form, Item, Input, Label, Left, Right, Body, Icon, Title, InputGroup, List, ListItem, Button} from 'native-base';
import { StackNavigator } from 'react-navigation';
import * as firebase from 'firebase';

console.disableYellowBox = true;

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

class OpenURLButton extends React.Component {
  static propTypes = {
    url: React.PropTypes.string,
  };

  handleClick = () => {
    Linking.canOpenURL(this.props.url).then(supported => {
      if (supported) {
        Linking.openURL(this.props.url);
      } else {
        console.log('Don\'t know how to open URI: ' + this.props.url);
      }
    });
  };

  render() {
    return (
      <TouchableHighlight
        onPress={this.handleClick} style={styles.button} underlayColor='#00FFCC'>
          <Text style={styles.buttonText}>Request Uber</Text>
      </TouchableHighlight>
    );
  }
}

class IntentAndroidExample extends React.Component {
  static title = 'Linking';
  static description = 'Shows how to use Linking to open URLs.';

  render() {
    return (
        <OpenURLButton style = {styles.button} url={'uber://'} />

    );
  }
}



module.exports = IntentAndroidExample;

class WelcomeScreen extends React.Component {
	constructor(props) {
		stripe.init({
	  		publishableKey: 'pk_test_1EEnYhGwfy50KhTeVRMkEbDH',
	  		merchantId: 'MERCHANT_ID', // Optional
		});

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
		title: 'WELCOME',
		header: {
		    titleStyle: {
		     	color: 'white',
		     	letterSpacing: 5,
		     	fontSize: 25,
				fontFamily: "oregon",
		     	fontWeight: '500'
		    },
		    style: {
		     	backgroundColor: '#00FFCC'
		    },
		    tintColor:'white',
			left: null,

		  }
	};

	async signup() {
		const { navigate } = this.props.navigation;

		try {
			await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password);

			console.log("Account created with " + this.state.email);

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
		title: ({ state }) => `SIGN UP`,
		header: {
		     titleStyle: {
		     	color: 'white',
		     	letterSpacing: 5,
		     	fontSize: 25,
				fontFamily: "oregon",
		     	fontWeight: '500'
		    },
		    style: {
		     	backgroundColor: '#00FFCC'
		    },
		    tintColor: 'white',
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

class ProfileScreen extends React.Component {
	static navigationOptions = {
		// Nav options can be defined as a function of the navigation prop:
		title: ({ state }) => 'PROFILE',
		header: {
		     titleStyle: {
		     	color: 'white',
		     	letterSpacing: 5,
		     	fontSize: 25,
				fontFamily: "oregon",
		     	fontWeight: '500'
		    },
		    style: {
		     	backgroundColor: '#00FFCC'
		    },
		    tintColor: 'white',
		}

	};

	constructor(props) {
		super(props);
		this.logout = this.logout.bind(this);
		this.getName = this.getName.bind(this);
		this.state = {
			name: '',
			uid: '',
			data: {
				list_chartersOwned: [],
				list_chartersJoined: []
			},
		};
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

	getTrips() {
		var chartersRef = firebase.database().ref('charters/');

		var chartersOwnedRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/charters-owned');

		var chartersOwned = [];
		var chartersJoined = [];

		chartersOwnedRef.on('value', (snap) => {
			snap.forEach((child) => {
				chartersRef.on('value', (innersnap) => {
					innersnap.forEach((innerchild) => {
						if (child.key == innerchild.key) chartersOwned.push(innerchild.val());
					})
				});
			});
		});

		var chartersJoinedRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/charters-joined');

		chartersJoinedRef.on('value', (snap) => {
			// get children as an array
			snap.forEach((child) => {
				chartersRef.on('value', (innersnap) => {
					innersnap.forEach((innerchild) => {
						if (child.key == innerchild.key) chartersJoined.push(innerchild.val());
					})
				});
			});
		});

		console.log(chartersJoined);

		this.setState({
			data: {
				list_chartersOwned: chartersOwned,
				list_chartersJoined: chartersJoined
			}
		});
	}

	getName() {
		var currentUid = firebase.auth().currentUser.uid;
		this.setState({
			uid: currentUid,
		 });
		var userRef = firebase.database().ref('users/' + currentUid);
		userRef.on('value', (snapshot) => {
			this.setState({ name: snapshot.val().name });
		});
	}

	componentWillMount() {
		this.getName();
		this.getTrips();
	}

	getTime(text) {
	 	var date = new Date(text);
	 	var d = String(date.toDateString() + ' ' + date.toLocaleTimeString());
		return d.substring(0, d.length - 6).concat(d.substring(d.length - 3, d.length));
	}

	render() {
		const { navigate } = this.props.navigation;

		return (
			<View style={{
				justifyContent: 'center',
				backgroundColor: 'white',
				flex: 1,
			}}>
				<View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 20}}>
					<View>
					<Thumbnail source={require('./two.jpg')} />
					</View>
					<View style={{paddingTop: 2}}>
						<Text style={styles.welcome}>{this.state.name}</Text>
					</View>
				</View>

				<View style={{flex: 5}}>

					<Separator bordered>
                        <Text style = {styles.bodyText}>Charters Owned:</Text>
                    </Separator>
					<List dataArray={this.state.data.list_chartersOwned} renderRow={(item) =>
						<ListItem button onPress={() => navigate('OwnDetail', { charterId: item.id })}>
							<Body>
								<Text style={{fontSize:18}}>{Destinations[item.destination]}</Text>
								<Text style={{fontSize:12}} note>{item.owner_name}</Text>
							</Body>
							<Right>
								<Text>{this.getTime([item.time])}</Text>
							</Right>
						</ListItem>
					} />
					<Separator bordered>
                        <Text style = {styles.bodyText}>Charters Joined:</Text>
                    </Separator>

					<List dataArray={this.state.data.list_chartersJoined} renderRow={(item) =>
						<ListItem button onPress={() => navigate('JoinDetail', { charterId: item.id })}>
							<Body>
								<Text style={{fontSize:18}}>{Destinations[item.destination]}</Text>
								<Text style={{fontSize:12}} note>{item.owner_name}</Text>
							</Body>
							<Right>
								<Text>{this.getTime([item.time])}</Text>
							</Right>
						</ListItem>
					} />
				</View>
				<TouchableHighlight style={styles.button} onPress={this.logout}>
					<Text style={styles.buttonText}>LOGOUT</Text>
				</TouchableHighlight>
			</View>
		);
	}
}

class SearchScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: new ListView.DataSource({
				rowHasChanged: (row1, row2) => row1 !== row2,
			}),
			textInputValue: ''
		};
	}

	static navigationOptions = {
		// Nav options can be defined as a function of the navigation prop:
		title: ({ state }) => 'SEARCH',
		header: {
		     titleStyle: {
		     	color: 'white',
		     	letterSpacing: 5,
		     	fontSize: 25,
				fontFamily: "oregon",
		     	fontWeight: '500'
		    },
		    style: {
		     	backgroundColor: '#00FFCC'
		    },
		    tintColor: 'white',
			left: null,
		  },
	};

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
				<TouchableHighlight style={styles.button} onPress={() => navigate('Intent', { })} underlayColor='#e2d662'>
					<Text style={styles.buttonText}>PAY</Text>
				</TouchableHighlight>
				<TouchableHighlight style={styles.button} onPress={() => navigate('Profile', {})} underlayColor='#e2d662'>
					<Text style={styles.buttonText}>PROFILE</Text>

				</TouchableHighlight>
			</View>
		);
	}
}

class ListScreen extends React.Component {
	static navigationOptions = {
		// Nav options can be defined as a function of the navigation prop:
		title: ({ state }) => `AVAILABLE CHARTERS`,
		header: {
		     titleStyle: {
		     	color: 'white',
		     	letterSpacing: 2,
		     	fontSize: 21,
				fontFamily: "oregon",
		     	fontWeight: '500'
		    },
		    style: {
		     	backgroundColor: '#00FFCC'
		    },
		    tintColor: 'white',

		}
	};

	constructor(props) {
		super(props);
		this.state = {
			data: {
				list_charters: []
			}
		};

	}

	listenForCharters(chartersRef) {
		const { navigate } = this.props.navigation;

		var d = this.props.navigation.state.params.dest;
		var t = this.props.navigation.state.params.time;

		chartersRef.on('value', (snap) => {

			// get children as an array
			var charters = [];
			snap.forEach((child) => {
				var qstart = new Date(child.val().time);
				if ((child.val().destination == d) && (qstart.getDate() == t.getDate())
					&& (qstart.getMonth() == t.getMonth()) && (qstart.getYear() == t.getYear()))
					charters.push(child.val());
			});
			//
			// if (charters.length == 0) {
			// 	Alert.alert('We could not find any charters for you. Maybe you should create one!', null, [
			// 		{text: 'Create New Charter', onPress: () => navigate('Create', {})},
			// 		{text: 'Start Over', onPress: () => navigate('Search', {})}
			// 	]);
			// }

			this.setState({
				data: {
					list_charters: charters
				}
			});

		});
	}

	componentDidMount() {
		this.listenForCharters(chartersRef);
	}

	getTime(text) {
		var date = new Date(text);
		var d = date.toLocaleTimeString();
		return d.substring(0, d.length - 6).concat(d.substring(d.length - 3, d.length));
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
		<List
			dataArray={this.state.data.list_charters}
			renderRow={(rowData) =>
				<ListItem avatar button onPress={() => navigate('Detail', { charterId: rowData.id })}>
					<Left>
						<Thumbnail source={require('./two.jpg')} />
					</Left>
					<Body>
						<Text style={{fontSize:18}}>{rowData.owner_name}</Text>
						<Text style={{fontSize:12}}>Pickup at {Pickups[rowData.pickup]}</Text>
					</Body>
					<Right>
						<Text>{[this.getTime(rowData.time)]}</Text>
					</Right>
				</ListItem>}
		/>

		</Row>
		</Grid>

		</Content>
		<TouchableHighlight style={styles.button} onPress={() => navigate('Create', {})} underlayColor='#00FFCC'>
				<Text style={styles.buttonText}>CREATE NEW RIDE</Text>
		</TouchableHighlight>
		</Container>
	);
}

}

class OwnDetailScreen extends React.Component {
	static navigationOptions = {
		// Nav options can be defined as a function of the navigation prop:
		title: ({ state }) => `RIDE DETAILS`,
		header: {
		    titleStyle: {
		     	color: 'white',
		     	letterSpacing: 5,
		     	fontSize: 25,
				fontFamily: "oregon",
		     	fontWeight: '500'
		    },
		    style: {
		     	backgroundColor: '#00FFCC'
		    },
		    tintColor: 'white',
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
		//ownerUid = "";

		this.componentWillMount = this.componentWillMount.bind(this);
		this.markCompleted = this.markCompleted.bind(this);
	}

	markCompleted() {
		const { params } = this.props.navigation.state;
		firebaseApp.database().ref('charters/' + params.charterId + '/active').set(false);
		Alert.alert(
			"Thanks for riding with Charter! Your fellow riders' deposits will be transferred to your account within 5-7 business days.",
			null,
			[
				{text: 'OK', onPress: () => console.log('OK')},
			])
	}

	// TODO Just time required here
	getTime(text) {
		var date = new Date(text);
		var d = String(date.toDateString() + ' ' + date.toLocaleTimeString());
		return d.substring(0, d.length - 6).concat(d.substring(d.length - 3, d.length));
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

		var list_riders = [];

		firebase.database().ref('charters/' + params.charterId + '/riders').on('value', (snap) => {

			// get children as an array
			snap.forEach((child) => {
				list_riders.push(child.key);
			});

		});

		var list_riders_names = [];
		for (var x in list_riders) {
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
			<Container backgroundColor='white'>
			<Content>

			<View>
			<Image  style={{width: 420, height: 220, flex: 1, justifyContent: 'center', alignItems: 'center'}}
              	source={require('./nyc.jpg')}
              />

              <ListItem>
				<Left><Text style={styles.bodyText}>{Destinations[this.state.destination]}</Text></Left>
				<Left><Text note>{this.getTime(this.state.time)}, {Pickups[this.state.pickup]}</Text></Left>
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
			<OpenURLButton style = {styles.button} url={'uber://'} />
			<TouchableHighlight style={styles.button} onPress={this.markCompleted}>
				<Text style={styles.buttonText}>Charter Completed</Text>
			</TouchableHighlight>

			</Container>



		);
	}
}

class JoinDetailScreen extends React.Component {
	static navigationOptions = {
		// Nav options can be defined as a function of the navigation prop:
		title: ({ state }) => `RIDE DETAILS`,
		header: {
		    titleStyle: {
		     	color: 'white',
		     	letterSpacing: 5,
		     	fontSize: 25,
				fontFamily: "oregon",
		     	fontWeight: '500'
		    },
		    style: {
		     	backgroundColor: '#00FFCC'
		    },
		    tintColor: 'white',
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
		//ownerUid = "";

		this.componentWillMount = this.componentWillMount.bind(this);
		this.leave = this.leave.bind(this);
		this.leavelogic = this.leavelogic.bind(this);
	}

	leavelogic() {
		const { params } = this.props.navigation.state;
		const { navigate } = this.props.navigation;
		firebaseApp.database().ref('charters/' + params.charterId + '/riders/' + firebase.auth().currentUser.uid).remove();
		firebaseApp.database().ref('users/' + firebase.auth().currentUser.uid + '/charters-joined/' + params.charterId).remove();
		navigate('Profile', {});
	}

	leave() {
		const { params } = this.props.navigation.state;

		Alert.alert(
			"Are you sure you want to leave this Charter?",
			'You will forfeit your deposit.',
			[
				{text: 'Yes', onPress: this.leavelogic},
				{text: 'No', onPress: () => console.log('NO')}
			])


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

		var list_riders = [];

		firebase.database().ref('charters/' + params.charterId + '/riders').on('value', (snap) => {

			// get children as an array
			snap.forEach((child) => {
				list_riders.push(child.key);
			});

		});

		var list_riders_names = [];
		for (var x in list_riders) {
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
			<Container backgroundColor='white'>
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
			<TouchableHighlight style={styles.button} onPress={this.leave}>
				<Text style={styles.buttonText}>LEAVE CHARTER</Text>
			</TouchableHighlight>
			</Container>

		);
	}
}

class DetailScreen extends React.Component {
	static navigationOptions = {
		// Nav options can be defined as a function of the navigation prop:
		title: ({ state }) => `RIDE DETAILS`,
		header: {
		     titleStyle: {
		     	color: 'white',
		     	letterSpacing: 5,
		     	fontSize: 25,
				fontFamily: "oregon",
		     	fontWeight: '500'
		    },
		    style: {
		     	backgroundColor: '#00FFCC'
		    },
		    tintColor: 'white',
		}
	};

	constructor(props) {
		super(props);
		this.state = {
			destination: "",
			ownerUid: "",
			pickup: "",
			time: "",
			timeline: {
				messages: []
			},
			ownerName: "",
			data: {
				riders: []
			},
			newMessage: "",
			loading: false,
			allowed: false,
			complete: true,
			status: null,
			token: null,
		};

		this.handleApplePayPress = this.handleApplePayPress.bind(this);
		this.componentWillMount = this.componentWillMount.bind(this);
		this.join = this.join.bind(this);
		this.postMessage = this.postMessage.bind(this);
	}

	handleApplePayPress = async () => {
		try {
			this.setState({
				loading: true,
				status: null,
				token: null,
			})
			const token = await stripe.paymentRequestWithApplePay([{
				label: 'Ride Deposit',
				amount: '10.00',
			}], {
				// requiredBillingAddressFields: 'all',
				// requiredShippingAddressFields: 'all',
				shippingMethods: [{
					id: 'Digital',
					label: 'Online',
					detail: 'FREE',
					amount: '0.00',
				}],
			})

			console.log('Result:', token)
			this.setState({ loading: false, token })

			if (this.state.complete) {
				await stripe.completeApplePayRequest()
				console.log('Apple Pay payment completed')
				this.setState({ status: 'Apple Pay payment completed'})
			} else {
				await stripe.cancelApplePayRequest()
				console.log('Apple Pay payment cenceled')
				this.setState({ status: 'Apple Pay payment cenceled'})
			}
		} catch (error) {
			console.log('Error:', error)
			this.setState({ loading: false, status: `Error: ${error.message}` })
		}
	}

	join() {
		const { params } = this.props.navigation.state;

		console.log(firebase.auth().currentUser.uid);
		console.log(this.state.ownerUid);

		if (firebase.auth().currentUser.uid != this.state.ownerUid) {
			firebaseApp.database().ref('charters/' + params.charterId + '/riders/' + firebase.auth().currentUser.uid).set(true);
			firebaseApp.database().ref('users/' + firebase.auth().currentUser.uid + '/charters-joined/' + params.charterId).set(true);
			var destination = this.state.destination;
			// Alert.alert(
			// 	"Congratulations! You're " + destination + " bound.",
			// 	null,
			// 	[
			// 		{text: 'OK', onPress: () => console.log('OK')},
			// 	]
			// );

			this.handleApplePayPress();
			setTimeout(() => {
	            this.setState(() => {
	                console.log('setting state');
	                return { unseen: "does not display" }
	            });
	        }, 2000);
		}

		else {
			// TODO Make the component for Join conditional so that it only shows up when owner != currentUser
			Alert.alert(
				"You can't join your own trip!",
				null,
				[
				  {text: 'OK', onPress: () => console.log('OK')},
				]
			 )
		}
	}

	async componentWillMount() {
		const { params } = this.props.navigation.state;

		const allowed = await stripe.deviceSupportsApplePay();
	    this.setState({ allowed });

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

		var list_riders = [];

		firebase.database().ref('charters/' + params.charterId + '/riders').on('value', (snap) => {

			// get children as an array
			snap.forEach((child) => {
				list_riders.push(child.key);
			});

		});

		var list_riders_names = [];
		for (var x in list_riders) {
			console.log(list_riders[x]);
			firebase.database().ref('users/' + list_riders[x]).on('value', (snap) => {
				list_riders_names.push(snap.val().name);
			});
		}

		console.log(list_riders_names);

		this.setState({
			data: {
				riders: list_riders_names
			}
		});

		var timelineRef = firebase.database().ref('charters/' + params.charterId + '/timeline');

		var list_messages = [];
		timelineRef.on('value', (snap) => {
			snap.forEach((child) => {
				var newMessage = {
					text: "",
					sender_name: ""
				}

				newMessage.text = child.val().text;
				newMessage.sender_name = child.val().sender_name;

				list_messages.push(newMessage);
			});
		});

		console.log(list_messages);

		this.setState({
			timeline: {
				messages: list_messages
			}
		});
	}

	postMessage() {
		const {params} = this.props.navigation.state;

		var timelineRef = firebase.database().ref('charters/' + params.charterId + '/timeline');

		// var newMessage = "";
		// AlertIOS.prompt(
		// 	'Post an update:',
		// 	null,
		// 	text => newMessage = text
		// );

		timelineRef.push({
			sender_name: firebase.auth().currentUser.displayName,
			text: this.state.newMessage
		})
	}

	componentDidMount() {
        setTimeout(() => {
            this.setState(() => {
                console.log('setting state');
                return { unseen: "does not display" }
            });
        }, 2000);
    }

	render() {
		// The screen's current route is passed in to `props.navigation.state`:
		const { params } = this.props.navigation.state;
		const { navigate } = this.props.navigation;

		return (
			<Container backgroundColor='white'>
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

			<List dataArray={this.state.data.riders} renderRow={(rowData) =>
				<ListItem avatar>
					<Left><Thumbnail source={require('./two.jpg')} /></Left>
					<Body><Text>{rowData}</Text></Body>
				</ListItem>} />

			<Text style={styles.bodyText}>Timeline:</Text>

			<Item regular>
				<Input onChangeText={(text) => this.setState({newMessage: text})} placeholder='Leave a Comment...'/>
				<Right><TouchableHighlight style={styles.sideButton} onPress={this.postMessage} underlayColor='#00FFCC'>
					<Text style={styles.sideButtonText}>SUBMIT</Text>
				</TouchableHighlight>
				</Right>
			</Item>

			<List dataArray={this.state.timeline.messages} renderRow={(rowData) =>
				<ListItem>
					<Text>{rowData.sender_name}: {rowData.text}</Text>
				</ListItem>} />

			</Content>
			<TouchableHighlight style={styles.button} onPress={this.join} underlayColor='#00FFCC'>
					<Text style={styles.buttonText}>JOIN RIDE</Text>
			</TouchableHighlight>
			</Container>



		);
	}
}

export default class CardFormScreen extends React.Component {
	  state = {
	    loading: false,
	    allowed: false,
	    complete: true,
	    status: null,
	    token: null,
	  }

	  async componentWillMount() {
	    const allowed = await stripe.deviceSupportsApplePay()
	    this.setState({ allowed })
	  }

	  handleCompleteChange = (complete) => (
	    this.setState({ complete })
	  )

	  handleApplePayPress = async () => {
	    try {
	      this.setState({
	        loading: true,
	        status: null,
	        token: null,
	      })
	      const token = await stripe.paymentRequestWithApplePay([{
	        label: 'Ride Deposit',
	        amount: '10.00',
	      }], {
	        // requiredBillingAddressFields: 'all',
	        // requiredShippingAddressFields: 'all',
	        shippingMethods: [{
	          id: 'Digital',
	          label: 'Online',
	          detail: 'FREE',
	          amount: '0.00',
	        }],
	      })

	      console.log('Result:', token)
	      this.setState({ loading: false, token })

	      if (this.state.complete) {
	        await stripe.completeApplePayRequest()
	        console.log('Apple Pay payment completed')
	        this.setState({ status: 'Apple Pay payment completed'})
	      } else {
	        await stripe.cancelApplePayRequest()
	        console.log('Apple Pay payment cenceled')
	        this.setState({ status: 'Apple Pay payment cenceled'})
	      }
	    } catch (error) {
	      console.log('Error:', error)
	      this.setState({ loading: false, status: `Error: ${error.message}` })
	    }
	  }

	  render() {
	    const { loading, allowed, complete, status, token } = this.state

	    return (
	      <View style={styles.container}>
	        <Text style={styles.header}>
	          Apple Pay Example
	        </Text>
	        <Text style={styles.instruction}>
	          Click button to show Apple Pay dialog.
	        </Text>
	        <Button
	          onPress={this.handleApplePayPress}
	        />
	        <Text style={styles.instruction}>
	          Complete the operation on tokent
	        </Text>
	        <Switch
	          style={styles.switch}
	          value={complete}
	          onValueChange={this.handleCompleteChange}

	        />
	        <View>
	          {token &&
	            <Text
	              style={styles.instruction}
	              >
	              Token: {token.tokenId}
	            </Text>
	          }
	          {status &&
	            <Text
	              style={styles.instruction}
	            >
	              {status}
	            </Text>
	          }
	        </View>
	        <View style={styles.hintContainer}>
	          <Button
	            text="Setup Pay"
	            disabledText="Not supported"
	            disabled={!allowed}
	            onPress={this.handleSetupApplePayPress}

	          />
	          <Text style={styles.hint}>
	            ('Setup Pay' works only on real device)
	          </Text>
	        </View>
	      </View>
	    )
	  }
	}

class CreateScreen extends React.Component {
	static navigationOptions = {
		// Nav options can be defined as a function of the navigation prop:
		title: ({ state }) => "CREATE A RIDE",
		header: {
		     titleStyle: {
		     	color: 'white',
		     	letterSpacing: 5,
		     	fontSize: 25,
				fontFamily: "oregon",
		     	fontWeight: '500'
		    },
		    style: {
		     	backgroundColor: '#00FFCC'
		    },
		    tintColor: 'white',
		}
	};

	onPress() {
		const { navigate } = this.props.navigation;
		var value = this.refs.form.getValue();
		var newCharterKey = firebase.database().ref('charters/').push().key;

		var newCharterData = {
			id: newCharterKey,
			active: true,
			destination: value.destination,
			owner: firebase.auth().currentUser.uid,
			owner_name: firebase.auth().currentUser.displayName,
			pickup: value.pickup,
			time: value.time.toString(),
		}

		firebase.database().ref('charters/' + newCharterKey).set(newCharterData);
		firebase.database().ref('charters/' + newCharterKey + '/timeline').push(
			{
				text: "Welcome to your new Charter! Use this timeline to post any updates.",
				sender_name: firebase.auth().currentUser.displayName
			}
		);

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
					label: 'When?',
					config: {
						format: (date) => {
							var d = String(date.toDateString() + ' ' + date.toLocaleTimeString());
							return d.substring(0, d.length - 6).concat(d.substring(d.length - 3, d.length));
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
		fontFamily: "Roboto",
		color: 'white',
		alignSelf: 'center',
		fontWeight: 'bold',
		letterSpacing: 2,
		textAlignVertical: 'center'
	},
	button: {
		height: 36,
		backgroundColor: '#4887c7',
		borderColor: 'white',
		borderWidth: 2,
		borderRadius: 8,
		alignSelf: 'stretch',
		justifyContent: 'center',

	},
	sideButton: {
		backgroundColor: 'white',
		height: 30,
		width: 100,
		borderColor: '#00FFCC',
		borderWidth: 2,
		borderRadius: 8,
		justifyContent: 'center',
	},
	sideButtonText: {
		fontSize: 15,
		fontFamily: "Roboto",
		color: '#00FFCC',
		alignSelf: 'center',
		fontWeight: 'bold',
		letterSpacing: 2,
		textAlignVertical: 'center'
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	bodyText: {
  		fontSize: 20,
  		fontWeight: 'bold',
		color: 'black',
		fontFamily: 'Roboto'
	}
});

const Charter = StackNavigator({
	Welcome: { screen: WelcomeScreen },
	Complete: { screen: CompleteScreen },
	Profile: { screen: ProfileScreen },
	List:   { screen: ListScreen   },
	Search: { screen: SearchScreen },
	Detail: { screen: DetailScreen },
	OwnDetail: { screen: OwnDetailScreen },
	JoinDetail: { screen: JoinDetailScreen },
	Create: { screen: CreateScreen },
	Intent: { screen: IntentAndroidExample },
}, {
      headerMode: 'screen'
});



AppRegistry.registerComponent('Charter', () => Charter);
