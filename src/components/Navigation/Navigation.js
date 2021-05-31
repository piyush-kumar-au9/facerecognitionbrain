import React from 'react';

const Navigation = ({onRouteChange, isSignedIn}) => {
	if(isSignedIn){		
	return(
		<nav style = { { display : "flex",  justifyContent: "flex-end"} }>
			<span onClick={() => onRouteChange('signout')}className="f3 link dim black underline pa3 pointer">Sign Out</span>
		</nav>
		);
	}

	else{
		return(
			<nav style = { { display : "flex",  justifyContent: "flex-end"} }>
				<span onClick={() => onRouteChange('signin')}className="f3 link dim black underline pa3 pointer">Sign In</span>
				<span onClick={() => onRouteChange('register')}className="f3 link dim black underline pa3 pointer">Register</span>
			</nav>
		);
	}
}

export default Navigation;