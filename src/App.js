import React,  { Component } from 'react';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import './App.css';

const app = new Clarifai.App({
 apiKey: process.env.REACT_APP_API_KEY
});
const particleOptions = {
particles: {
	number:{
		value: 20,
		density: {
			enable: true,
			value_area: 100
		}
	}
}
}
const initialState = {
	input: ' ',
	imageUrl: ' ',
 	box : [],
	route: 'signin',
	isSignedIn: false, 
	user : 
	{
        id:' ',
        name:'', 
        email:'',
        password:'',
        entries:0,
        joined: ''
	}
}
class App extends Component {
	constructor(){
		super();
		this.state = initialState;
	}

	loadUser = (data) => {
		this.setState({ user :{
            id:data.id,
            name:data.name, 
            email:data.email,
            password:data.password,
            entries:data.entries,
            joined: data.joined } 
		})
	}
	calculateFaceLocation = (datas) => {
		const datasArray = datas.outputs[0].data.regions;
		const clarifaiFaces = datasArray.map(data => data.region_info.bounding_box);
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number (image.height);
		return clarifaiFaces.map(clarifaiFace => 
			{
				return {		
					leftCol: clarifaiFace.left_col * width ,
					topRow: clarifaiFace.top_row * height,
					rightCol: width - (clarifaiFace.right_col * width),
					bottomRow: height - (clarifaiFace.bottom_row * height)
				} 	
			});
	}

	displayFaceBox = (newBox) => {
		this.setState({ box : newBox});
	}


	onInputChange = (event) => {
		this.setState({ input : event.target.value });
	}
	onPictureSubmit = () => {
		this.setState({ imageUrl: this.state.input });
		app.models.predict(Clarifai.FACE_DETECT_MODEL,  this.state.input)
		.then( (response) => { 
			if(response)
			{
				fetch("http://localhost:5000/image", {
					method :'put',
					headers : { 'Content-type' : 'application/json' },
					body : JSON.stringify({
						id : this.state.user.id
					})
				})
				.then(response => response.json())
				.then(count => {this.setState(Object.assign(this.state.user, {entries: count}))})
			}
			this.displayFaceBox(this.calculateFaceLocation(response)); 
		} )
		.catch( (err) => { 
			this.setState({box: []})
			console.log(err); } )
	}

	onRouteChange = (route) => {
	    if (route === 'signout') {
	      this.setState(initialState)
	    } else if (route === 'home') {
	      this.setState({isSignedIn: true})
	    }

		this.setState({route : route});
	}
	render() {
		const { imageUrl, box, route, isSignedIn, user }  =  this.state;
		return (
		    <div className="App">
			    <Particles className="particles"
	              params={particleOptions}
	            />
		    	<Navigation onRouteChange = {this.onRouteChange} isSignedIn= {isSignedIn}/>

		    	{ 
		    		route === 'home' 
		    		? <div>
    					<Logo />
    					<Rank name={user.name} entries= {user.entries} />
    					<ImageLinkForm 
    					onInputChange = {this.onInputChange}
    					onPictureSubmit = {this.onPictureSubmit}/>
    					<FaceRecognition imageUrl = {imageUrl}  box = {box}/>
    				</div>
		    		: (
		    			route === 'signin'
		    			?<SignIn loadUser = {this.loadUser} onRouteChange= {this.onRouteChange} />
		    			:<Register loadUser = {this.loadUser}  onRouteChange = {this.onRouteChange} />)
    				}
				
		    </div>
		);
	}
  
}

export default App;
