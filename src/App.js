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
console.log(process.env.REACT_APP_API_KEY)
class App extends Component {
	constructor(){
		super();
		this.state = {
			input: ' ',
			imageUrl: ' ',
		 	box : [],
			route: 'signin',
			isSignedIn: false
		}
	}


	calculateFaceLocation = (datas) => {
		console.log(datas);
		const datasArray = datas.outputs[0].data.regions;
		const clarifaiFaces = datasArray.map(data => data.region_info.bounding_box);
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number (image.height);
		console.log(clarifaiFaces, width, height);
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
		console.log(newBox);
		this.setState({ box : newBox});
	}


	onInputChange = (event) => {
		this.setState({ input : event.target.value });
	}
	onButtonSubmit = () => {
		this.setState({ imageUrl: this.state.input });
		app.models.predict(Clarifai.FACE_DETECT_MODEL,  this.state.input)
		.then( (response) => { this.displayFaceBox(this.calculateFaceLocation(response)); } )
		.catch( (err) => { 
			this.setState({box: []})
			console.log(err); } )
	}

	onRouteChange = (routePage) => {
		if(routePage === 'home'){
			this.setState({isSignedIn : true});
		}
		else{
			this.setState({isSignedIn : false});
		}

		this.setState({route : routePage});
	}
	render() {
		const { imageUrl, box, route, isSignedIn }  =  this.state;
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
    					<Rank />
    					<ImageLinkForm 
    					onInputChange = {this.onInputChange}
    					onButtonSubmit = {this.onButtonSubmit}/>
    					<FaceRecognition imageUrl = {imageUrl}  box = {box}/>
    				</div>
		    		: (
		    			route === 'signin'
		    			?<SignIn onRouteChange= {this.onRouteChange} />
		    			:<Register onRouteChange = {this.onRouteChange} />)
    				}
				
		    </div>
		);
	}
  
}

export default App;
