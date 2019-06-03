import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import firebase from './firebase.js';
import UploadRecipe from './RecipeUpload.tsx';
import updateApp from './index.js';
var listings = [];

function RecipeIndex() {
	listings.length = 0;
	var ref = firebase.database().ref("recipes");
	ref.orderByValue().on("value", function(snapshot) {
	  snapshot.forEach(function(data) {
		  var listing = "<div>";
		  listing = listing + "<h1>" + data.val().title + "</h1>";
		  listing = listing + "<h2>" + data.val().description + "</h2>";
		  listing = listing + "<h2>Recipe by: " + data.val().user + "</h2>";
		  var ing = data.val().ingredients;
		  var meas = data.val().measurements;
		  var stps = data.val().steps;
		  var i;
		  listing = listing + "<ul>"
		  for (i = 0; i < ing.length; i++){
			  listing = listing + "<li>" + ing[i] + ", " + meas[i] + "</li>";
		  }
		  listing = listing + "</ul>"
		  listing = listing + "<h3>Steps</h4>";
		  listing = listing + "<ul>"
		  for (i = 0; i < stps.length; i++){
			  listing = listing + "<li>" + stps[i] + "</li>";
		  }
		  listing = listing + "</ul>"
		console.log(listing);
		listing = listing + "</div>";
		listings.push(listing);
	  });
	});
}
RecipeIndex();

//this is the html for the login page
class IndexPage extends React.Component {
	render(){
	var page;
	page =
	<div dangerouslySetInnerHTML={{__html: listings}}>
	</div>
	return page;
	}
}












//heres where the website is run and rendered
//setPageOnStartup();



export default IndexPage;