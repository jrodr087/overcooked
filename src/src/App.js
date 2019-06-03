import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import firebase from './firebase.js';
import UploadRecipe from './RecipeUpload.tsx';
import updateApp from './index.js';
var email;
var userpassword;
var userconfirmpassword;
var uid;
var database = firebase.database();
var notifmessage = "";
var registernotifmessage = "";
var loggedIn;
var currPage;
var	user = firebase.auth().currentUser;

firebase.auth().onAuthStateChanged(function(user) {
	console.log("user state changed");
  if (user) {
    loggedIn = true;
	currPage = <LoggedInPage/>;

  } else {
    loggedIn = false;
	currPage = <LoginPage/>;
  }
  updateApp();
});

//this is the html for the login page
class LoginPage extends React.Component {
	render(){
	var page;
	page =
	<div>
	  <header>
		<h1>
			<p> Login </p>
		</h1>
		<h2>
			<p>Email: </p>
			<input type="text" name="email" onChange={handleChangeEmail}/><br/>
			<p>Password: </p>
			<input type="password" name="userpassword" onChange={handleChangePass}/><br/>
			<input type="submit" value="Login" onClick={login}/>
		</h2>
		<h3>
			<p>{notifmessage}</p>
			<input type="submit" value="Register?" onClick={ChangeToRegisterPage}/>
		</h3>
	  </header>
	</div>
	return page;
	}
}

class LoggedInPage extends React.Component {
	render(){
	var page;
	page =
		<div>
		  <header>
			<h1>
				<p> hey you're logged in </p>
			</h1>
			<h2>
				<p> log out? </p>
				<input type="submit" value="log off" onClick={logout}/>
			</h2>

		  </header>
		</div>
	return page;
	}
}
class RegisterPage extends React.Component {
	render(){
	var page;
	page =
	<div>
	  <header>
		<h1>
			<p> Register </p>
		</h1>
		<h2>
			<p>Email: </p>
			<input type="text" name="email" onChange={handleChangeEmail}/><br/>
			<p>Password: </p>
			<input type="password" name="userpassword" onChange={handleChangePass}/><br/>
			<p>Confirm password: </p>
			<input type="password" name="userconfirmpassword" onChange={handleChangeConfirmPass}/><br/>
			<input type="submit" value="register" onClick={register}/>
		</h2>
		<h3>
			<p>{registernotifmessage}</p>
		</h3>
		<h4>
			<input type="submit" value="back to login" onClick={ChangeToLoginPage}/>
		</h4>
	  </header>
	</div>

	return page;
	}
}

function setPageOnStartup(){
//	updateApp();
}
function App() {
  return (
    currPage
  );
}





///transition functions
function ChangeToRegisterPage(){
	currPage = <RegisterPage/>;
	registernotifmessage = "";
	updateApp();
}
function ChangeToLoginPage(){
	currPage = <LoginPage/>;
	updateApp();
}
function ChangeToRecipeUploadPage(){
	currPage = <UploadRecipe/>;
	updateApp();
}




////watches for changes in variables
function handleChangeEmail(event){
	email = event.target.value;
}
function handleChangePass(event){
	userpassword = event.target.value;
}
function handleChangeConfirmPass(event){
	userconfirmpassword = event.target.value;
}




///account login/register functions
function login(){
	console.log(email);
	firebase.auth().signInWithEmailAndPassword(email, userpassword);
	user = firebase.auth().currentUser;
	if (user){
		notifmessage = "signed in";
	} else{
		notifmessage = "sign in failed";
	}
}
function logout(){
	firebase.auth().signOut();
	user = firebase.auth().currentUser;
	updateApp();
	window.location.reload();
}

function register(){
	if (userpassword === userconfirmpassword){
		try
			{
				firebase.auth().createUserWithEmailAndPassword(email, userpassword)
			}
		catch(error){
			console.log(error.message);
			registernotifmessage = error.message;
			updateApp();
		}

		firebase.auth().onAuthStateChanged(function(user) {
  			if (user) {
    				// User is signed in.
				console.log('uid', user.uid);
				firebase.database().ref('accounts/' + user.uid + '/bookmarks').set({0: ""});
  			} else {
    				// No user is signed in.
  			}
});

	}
	else{
		registernotifmessage = "passwords do not match";
		//currPage = <RegisterPage/>;
		updateApp();
	}
}

currPage = <LoginPage/>;


//heres where the website is run and rendered
//setPageOnStartup();



export default App;
